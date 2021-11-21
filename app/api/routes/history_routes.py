"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.
"""

import re
from datetime import datetime
from flask import Blueprint, request
from app.models import db, History
from app.forms import SearchForm
from flask_login import current_user, login_required
from flask.helpers import make_response

#$ Process Import
# from scrapy.crawler import CrawlerProcess
# from scrapy.utils.project import get_project_settings
# from scrapy.utils.log import configure_logging

#$ Twisted Import
from twisted.internet import reactor

from scrapy.crawler import CrawlerRunner

history_routes = Blueprint('entries', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Turn the WTForms validation errors into a simple list."""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(error)
    return errorMessages

@history_routes.route('/', methods=['POST'])
@login_required
def add_history_entry():
    """Add a search entry to history."""
    form = SearchForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
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

        query = form.data['search']
        history_entry = History(
            user_id=current_user.id,
            search=query,
            tz=js_tz_parsed,
            tz_abbrev=js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0],
            updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
        )

        query_file = open('app/crawler/query.json', 'w')
        query_file.write(f'{{"query": "{query}"}}')
        query_file.close()

        from app.crawler.spider_lair.spiders.caerostris_darwini import CDCommentarial
        runner = CrawlerRunner()
        runner.crawl(CDCommentarial)

        #$ Process Way
        # process = CrawlerProcess(get_project_settings())

        #$ Twisted Way
        # deferred = runner.join()
        # deferred.addBoth(lambda _: reactor.stop())
        # reactor.run()

        #$ Process Way
        # process.crawl(CDCommentarial)
        # process.start()
        # process.start(stop_after_crawl=False)

        db.session.add(history_entry)
        db.session.commit()
        entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
        return { 'history': [ entry.to_dict() for entry in entries ] }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@history_routes.route('/')
@login_required
def get_history_entries():
    """Get all of the history entries."""
    entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
    response = make_response({ 'history': [ entry.to_dict() for entry in entries ] })
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response

@history_routes.route('/<int:entryID>', methods=['PATCH'])
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

@history_routes.route('/<int:entryID>', methods=['DELETE'])
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