import React from 'react'
import { FaBug,FaStop, FaMagic, FaBrain} from 'react-icons/fa';
import { MdDone } from 'react-icons/md';
import {RiFileSearchFill} from 'react-icons/ri'
import {DiGitBranch} from 'react-icons/di'
import {AiOutlineFileDone} from 'react-icons/ai'
const task_state  = [
    { value: 'progress', label: <div className="select-element"><DiGitBranch fill="green"/><div className="select-text">In Progress</div></div> },
    { value: 'test', label: <div className="select-element"><RiFileSearchFill fill="orange"/><div className="select-text">Test</div></div> },
    { value: 'done', label: <div className="select-element"><AiOutlineFileDone fill="violet"/><div className="select-text">Done</div></div> },
    { value: 'blank', label: <div className="select-element"><FaStop fill="grey"/><div className="select-text">Blank</div></div> },

  ];
export default task_state
