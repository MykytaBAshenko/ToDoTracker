import React from 'react'
import { FaBug,FaStop, FaMagic, FaBrain} from 'react-icons/fa';
import { MdDone } from 'react-icons/md';

const how_task_is_nedded  = [
    { value: 'bug', label:  <div className="select-element"><FaBug fill="red"/><div className="select-text">Bug</div></div>,icon:<FaBug fill="red"/> },
    { value: 'task', label: <div className="select-element"><MdDone  fill="green"/><div className="select-text">Task</div></div>,icon: <MdDone  fill="green"/> },
    { value: 'feature', label: <div className="select-element"><FaMagic fill="green"/><div className="select-text">Feature</div></div>, icon: <FaMagic fill="green"/> },
    { value: 'idea', label: <div className="select-element"><FaBrain fill="pink"/><div className="select-text">Idea</div></div>, icon: <FaBrain fill="pink"/> },
    { value: 'blank', label: <div className="select-element"><FaStop fill="grey"/><div className="select-text">Blank</div></div>, icon: <FaStop fill="grey"/> },
 
  ];
export default how_task_is_nedded
