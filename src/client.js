import ReactDOM from 'react-dom';
import React from 'react';

import App from './app';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'


ReactDOM.render(<DndProvider backend={HTML5Backend}><App /></DndProvider>, document.getElementById('app'));



