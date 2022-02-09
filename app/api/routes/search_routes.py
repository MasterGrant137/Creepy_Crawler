"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.

Printing item in _crawler_result definition
will give a stdout of the crawler's yield.
"""

import crochet
crochet.setup()

from scrapy import signals
from scrapy.crawler import CrawlerRunner
from scrapy.signalmanager import dispatcher
from scrapy.utils.project import get_project_settings
from app.crawler.spider_lair.spiders import caerostris_darwini, theraphosidae

import re
import json
from datetime import datetime
from flask import Blueprint, request
from app.models import db, History
from app.forms import SearchForm
from flask_login import current_user, login_required

output_data = []
stop_word_set = {'ourselves', 'hers', 'between', 'yourself', 'but', 'again', 'there', 'about', 'once', 'during', 'out', 'very', 'having', 'with', 'they', 'own', 'an', 'be', 'some', 'for', 'do', 'its', 'yours', 'such', 'into', 'of', 'most', 'itself', 'other', 'off', 'is', 's', 'am', 'or', 'who', 'as', 'from', 'him', 'each', 'the', 'themselves', 'until', 'below', 'are', 'we', 'these', 'your', 'his', 'through', 'don', 'nor', 'me', 'were', 'her', 'more', 'himself', 'this', 'down', 'should', 'our', 'their', 'while', 'above', 'both', 'up', 'to', 'ours', 'had', 'she', 'all', 'no', 'when', 'at', 'any', 'before', 'them', 'same', 'and', 'been', 'have', 'in', 'will', 'on', 'does', 'yourselves', 'then', 'that', 'because', 'what', 'over', 'why', 'so', 'can', 'did', 'not', 'now', 'under', 'he', 'you', 'herself', 'has', 'just', 'where', 'too', 'only', 'myself', 'which', 'those', 'i', 'after', 'few', 'whom', 't', 'being', 'if', 'theirs', 'my', 'against', 'a', 'by', 'doing', 'it', 'how', 'further', 'was', 'here', 'than'}
settings = get_project_settings()
settings_dict = json.load(open('app/api/routes/settings.json'))
settings.update(settings_dict)
crawl_runner = CrawlerRunner(settings)
search_routes = Blueprint('entries', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Turn the WTForms validation errors into a simple list."""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(error)
    return errorMessages

@search_routes.route('/history/searches/', methods=['POST'])
def add_search_entry():
    """Add a search entry to history."""
    form = SearchForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        raw_query = form.data['search']
        try: 
            if request.json['origin'] == 'home_search': 
                request.json['user']['id'] == current_user.id
                js_tstamp = request.json['updatedAt']
                js_tstamp_regex = re.compile(r'''
                ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date and time
                ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
                \((.*)\) #? time zone
                ''', re.VERBOSE)
                abbrevTZRegex = r'([A-Z]){1}[-]?[a-z]+'
                natoTZRegex = r'[A-Z]TZ'

                js_date_parsed = re.search(js_tstamp_regex, js_tstamp).group(1)
                js_tz_parsed = re.search(js_tstamp_regex, js_tstamp).group(3)
                js_tz_abbrev = ''.join(re.findall(abbrevTZRegex, js_tz_parsed))

                history_entry = History(
                    user_id=current_user.id,
                    search=raw_query,
                    tz=js_tz_parsed,
                    tz_abbrev=js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0],
                    updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
                )
                
                db.session.add(history_entry)
                db.session.commit()
                entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
                scrape_with_crochet(raw_query)
                return { 'history': [ entry.to_dict() for entry in entries ] }
            else:
                entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
                scrape_with_crochet(raw_query)
                return { 'history': [ entry.to_dict() for entry in entries ] }
        except:
            scrape_with_crochet(raw_query)
            return { 'message': ["Log in or sign up to record search and visit history."] }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@crochet.wait_for(timeout=200.0)
def scrape_with_crochet(raw_query):
    r"""Connect Flask with Scrapy asynchronously.
    
    In regard to the partitioned query's regular expression:
        - Assert string is not preceded by any word characters (negative lookbehind): `(?<!\w)`
        - Only match match strings followed by specified characters: `[\s|.|,|?|!|:|;|-]` (i.e., a
          space or punctuation)
    """
    partitioned_query = ('|').join([f'(?<!\w){i}[\s|.|,|?|!|:|;|-]' for i in raw_query.split() if i not in stop_word_set])
    query_regex = re.compile(rf'{partitioned_query}', re.I)
    dispatcher.connect(_crawler_result, signal=signals.item_scraped)
    # broad_crawlers = [caerostris_darwini.BroadCrawler1, caerostris_darwini.BroadCrawler2, caerostris_darwini.BroadCrawler3, caerostris_darwini.BroadCrawler4, caerostris_darwini.BroadCrawler5, caerostris_darwini.BroadCrawler6, caerostris_darwini.BroadCrawler7, caerostris_darwini.BroadCrawler8]
    deep_crawlers = [theraphosidae.DeepCrawler1]
    if len(partitioned_query):
        # for broad_crawler in broad_crawlers: crawl_runner.crawl(broad_crawler, query_regex=query_regex)
        for deep_crawler in deep_crawlers: crawl_runner.crawl(deep_crawler, raw_query=raw_query)
        eventual = crawl_runner.join()
        return eventual

def _crawler_result(item, response, spider):
    """Typecast each element of crawler's yield into dictionary and append to list."""
    output_data.append(dict(item))

@search_routes.route('/history/visits/', methods=['POST'])
def add_visit_entry():
    """Add a visit entry to history."""
    try:
        request.json['user']['id'] == current_user.id
        js_tstamp = request.json['updatedAt']
        js_tstamp_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date and time
        ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
        \((.*)\) #? time zone
        ''', re.VERBOSE)
        abbrevTZRegex = r'([A-Z]){1}[-]?[a-z]+'
        natoTZRegex = r'[A-Z]TZ'

        js_date_parsed = re.search(js_tstamp_regex, js_tstamp).group(1)
        js_tz_parsed = re.search(js_tstamp_regex, js_tstamp).group(3)
        js_tz_abbrev = ''.join(re.findall(abbrevTZRegex, js_tz_parsed))

        history_entry = History(
            user_id=current_user.id,
            tz=js_tz_parsed,
            tz_abbrev=js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0],
            updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S'),
            visit=request.json['visit']
        )

        db.session.add(history_entry)
        db.session.commit()
        entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
        return { 'history': [ entry.to_dict() for entry in entries ] }
    except:
        return { 'message': ["Log in or sign up to record search and visit history."] }

@search_routes.route('/results/')
def read_results():
    """Get all the crawl results."""
    response = {'results': [[result['url'], result['text']] for result in output_data]}
    output_data.clear()
    return response

@search_routes.route('/history/')
@login_required
def get_history_entries():
    """Get all of the history entries."""
    entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
    return { 'history': [ entry.to_dict() for entry in entries ] }

@search_routes.route('history/<int:entryID>', methods=['PATCH'])
@login_required
def alter_history_entry(entryID):
    """Change the history entry's date and time information."""
    entry = History.query.filter(History.id == entryID).first()

    if entry.user_id == current_user.id:
        js_tstamp = request.json['updatedAt']
        js_tstamp_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date and time
        ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
        \((.*)\) #? tz
        ''', re.VERBOSE)
        abbrevTZRegex = r'([A-Z]){1}[-]?[a-z]+'
        natoTZRegex = r'[A-Z]TZ'

        js_date_parsed = re.search(js_tstamp_regex, js_tstamp).group(1)
        js_tz_parsed = re.search(js_tstamp_regex, js_tstamp).group(3)
        js_tz_abbrev = ''.join(re.findall(abbrevTZRegex, js_tz_parsed))

        new_updated_at = datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
        entry.updated_at = new_updated_at
        entry.tz = js_tz_parsed
        entry.tz_abbrev = js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0]

        db.session.add(entry)
        db.session.commit()
        entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
        return { 'history': [ entry.to_dict() for entry in entries ] }
    return {'errors': ['You are not permitted to edit this entry!']}, 401

@search_routes.route('history/<int:entryID>', methods=['DELETE'])
@login_required
def delete_history_entry(entryID):
    """Delete history entry."""
    entry = History.query.filter(History.id == entryID).first()

    if entry.user_id == current_user.id:
        db.session.delete(entry)
        db.session.commit()
        entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
        return { 'history': [ entry.to_dict() for entry in entries ] }
    return { 'errors': ['You are not permitted to delete this entry!'] }, 401