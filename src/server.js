import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import path from 'path';
import App from './app';
import template from './template';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'

const app = express();

app.use(express.static('dist/public'));
console.log('path :' + __dirname + '/dist/public')

app.get('/', (req, res) => {

    const body = renderToString(<DndProvider backend={HTML5Backend}><App /></DndProvider>);
    const html = template(body);
    res.send(html);
})


app.listen(3000, () => {

    console.log('Listening on port 3000');
})