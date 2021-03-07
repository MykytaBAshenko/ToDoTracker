import React from 'react'
import { FaStop,FaAngleUp, FaAngleDown, FaMinus  } from 'react-icons/fa';


const how_task_is_nedded  = [
    { value: 'high', label:  <div className="select-element"><FaAngleUp fill="red"/><div className="select-text">High</div></div> },
    { value: 'medium', label: <div className="select-element"><FaMinus  fill="orange"/><div className="select-text">Medium</div></div> },
    { value: 'low', label: <div className="select-element"><FaAngleDown fill="green"/><div className="select-text">Low</div></div> },
    { value: 'blank', label: <div className="select-element"><FaStop fill="grey"/><div className="select-text">Blank</div></div> },

  ];
export default how_task_is_nedded