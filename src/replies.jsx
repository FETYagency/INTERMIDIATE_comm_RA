import { useRef, useState } from "react"
import { flushSync } from 'react-dom';

import Initiator from "./initiator"

import MinusIcon from "./svg's/minus"
import PlusIcon from "./svg's/plus"
import DeleteIcon from "./svg's/delete"
import EditIcon from "./svg's/edit"
import ReplyIcon from "./svg's/reply"

export default function Replies({replies, currUser, isOnReply, isOnEdit, handleIsOnEdit, handleIsOnReply, repliesBelong, onAddReply, onEditedReply, onAskToDelete}){
    let Replies_compo = replies.map(per=>{
        let isCurrUser = per.user.username===currUser.username;
        return <Reply key={per.id} isCurrUser={isCurrUser} currUser={currUser} replyData={per} handleIsOnReply={handleIsOnReply} isOnReply={isOnReply} isOnEdit={isOnEdit} handleIsOnEdit={handleIsOnEdit} repliesBelong={repliesBelong} onAddReply={onAddReply} onEditedReply={onEditedReply} onAskToDelete={onAskToDelete}/>
    })
    return(
        <div className="replies">
            {Replies_compo}
        </div>
    )
}


function Reply({isCurrUser, currUser, replyData, handleIsOnReply, isOnReply, isOnEdit, handleIsOnEdit, repliesBelong, onAddReply, onEditedReply, onAskToDelete}) {
    let [text, setText] = useState(replyData.content)
    let [score, setScore] = useState(replyData.score)
    let [which, setWhich] = useState(undefined)
    let input = useRef(null)
    let replyInput = useRef(null)
    return(
        <div className='replyPost'>

            <div className="reply">
                
                <div className="userData">
                    <div className="image">
                        <img src={replyData.user.image.png}/>
                    </div>
                    <h3 className="userName">{replyData.user.username}</h3>
                    {isCurrUser&&<span className="label_you">you</span>}
                    <p className="createdAt">{replyData.createdAt}</p>
                </div>

                <div className="scoreCounter">
                    <span onClick={e=>{
                        if(!isCurrUser){
                            if(which===undefined||which==="minus"){
                                setScore(replyData.score+1)
                                setWhich("plus")
                                
                            }
                        }
                    }}>
                        <PlusIcon/>
                    </span>
                    <div className="boldScore">{score}</div>
                    <span onClick={e=>{
                        if(!isCurrUser){
                            if(which===undefined||which==="plus"){
                                setScore(replyData.score-1)
                                setWhich("minus")
                                
                            }
                        }
                    }}>
                        <MinusIcon/>
                    </span>
                </div>     

                <div className="content">
                    {
                        isCurrUser
                        ?(
                            <>
                                {
                                    !(isOnEdit===replyData.id)
                                    ?(<p><span>{"@"+replyData.replyingTo+" "}</span>{replyData.content}</p> )
                                    :(
                                        <div className="editor">
                                            <textarea className='editContent' value={text} onInput={e=>setText(e.target.value)} ref={input}></textarea>
                                            <button className="action-btn" onClick={e=>{
                                                if(text!==""){
                                                    handleIsOnEdit(0)
                                                    onEditedReply(text,repliesBelong,replyData.id)
                                                }
                                            }}>EDIT</button>
                                        </div>
                                    )
                                }
                                
                            </>
                        )
                        :(<p><span>{"@"+replyData.replyingTo+" "}</span>{replyData.content}</p>)
                    }
                </div>

                <div className="buttons">
                    {
                        isCurrUser
                        ?(
                            <>
                                <button className="config-delete" onClick={e=>onAskToDelete(true, {id:replyData.id, forComm:false, repliesBelong:repliesBelong})}><DeleteIcon/>Delete</button>
                                <button className="config-edit" onClick={()=>{
                                    flushSync(()=>{
                                        handleIsOnEdit(replyData.id!==isOnReply?replyData.id:0)
                                    })
                                    if(input.current!==null){
                                        input.current.focus()
                                    }
                                }}><EditIcon/>Edit</button>
                            </>
                        )
                        :(<button className="config-reply" onClick={e=>{
                            flushSync(()=>{
                                handleIsOnReply(replyData.id!==isOnReply?replyData.id:0)
                            })
                            if(replyInput.current!==null){
                                replyInput.current.focus();                            
                            }                            
                        }}><ReplyIcon/>Reply</button>)
                    }
                </div>
                
            </div>
            
            {
                !isCurrUser
                &&
                isOnReply===replyData.id&&<Initiator currUser={currUser} replyingTo={replyData} repliesBelong={repliesBelong} onAddReply={onAddReply} ref={replyInput} handleIsOnReply={handleIsOnReply}/>
            }
            
        </div>
    )
}