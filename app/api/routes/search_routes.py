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
from app.crawler.spider_lair.spiders import caerostris_darwini

import re
import json
from datetime import datetime
from flask import Blueprint, request
from app.models import db, History
from app.forms import SearchForm
from flask_login import current_user, login_required

output_data = []
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
        query = form.data['search']
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
                search=query,
                tz=js_tz_parsed,
                tz_abbrev=js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0],
                updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
            )
            
            db.session.add(history_entry)
            db.session.commit()
            entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
            scrape_with_crochet(query)
            return { 'history': [ entry.to_dict() for entry in entries ] }
        except:
            scrape_with_crochet(query)
            return { 'message': ["Log in or sign up to record search and visit history."] }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@crochet.wait_for(timeout=200.0)
def scrape_with_crochet(query):
    """Connect Flask with Scrapy asynchronously."""
    dispatcher.connect(_crawler_result, signal=signals.item_scraped)
    # spiders = [caerostris_darwini.CDCommentarial, caerostris_darwini.CDEncyclopedic]
    spiders = [caerostris_darwini.CDBroadCrawler1]
    [crawl_runner.crawl(spider, query=query) for spider in spiders]
    eventual = crawl_runner.join()
    return eventual

def _crawler_result(item, response, spider):
    """Typecast each element of crawler's yield into dictionary and append to list."""
    # print(response, spider)
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