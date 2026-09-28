import React from 'react';
import {renderToString} from 'react-dom/server';
import Site from '../app/site';
export function render(page:string){return renderToString(<Site page={page} publicBase="" serviceOrigin="https://worklanceo.com"/>)}
