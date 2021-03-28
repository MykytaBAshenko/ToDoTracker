import React from 'react'
import { FaBug, FaMagic, FaBrain} from 'react-icons/fa';
import { MdDone } from 'react-icons/md';

const task_state  = [
    { value: 'blank', label:  <div className="select-element"><FaBug fill="red"/><div className="select-text">Bug</div></div> },
    { value: 'progress', label: <div className="select-element"><MdDone  fill="green"/><div className="select-text">Task</div></div> },
    { value: 'test', label: <div className="select-element"><FaMagic fill="green"/><div className="select-text">Feature</div></div> },
    { value: 'done', label: <div className="select-element"><FaBrain fill="pink"/><div className="select-text">Idea</div></div> },

  ];
export default how_task_is_nedded
