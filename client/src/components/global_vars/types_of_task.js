import React from 'react'
import { FaBug, FaMagic, FaBrain} from 'react-icons/fa';
import { MdDone } from 'react-icons/md';

const how_task_is_nedded  = [
    { value: 'bug', label:  <div className="select-element"><FaBug fill="red"/><div className="select-text">Bug</div></div> },
    { value: 'task', label: <div className="select-element"><MdDone  fill="green"/><div className="select-text">Task</div></div> },
    { value: 'feature', label: <div className="select-element"><FaMagic fill="green"/><div className="select-text">Feature</div></div> },
    { value: 'idea', label: <div className="select-element"><FaBrain fill="pink"/><div className="select-text">Idea</div></div> },

  ];
export default how_task_is_nedded
