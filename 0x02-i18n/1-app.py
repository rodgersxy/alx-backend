#!/usr/bin/env python3
"""
Basic Flask app
1-app.py
"""

from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """
    Config class
    """
    LANGUAGES = ['en', 'fr']


app.config.from_object(Config)
babel.default_locale = 'en'
babel.default_timezone = 'UTC'


@app.route('/', methods=['GET'])
def index():
    """
    index
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
