#!/usr/bin/env python3
"""
Basic Flask app
0-app.py
"""

from flask import Flask, render_template

# instance of Flask named app
app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    """
    index
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
