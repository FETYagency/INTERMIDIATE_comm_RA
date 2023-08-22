import { useRef, useState } from "react";

import Initiator from "./initiator"
import Replies from "./replies";

import MinusIcon from "./svg's/minus"
import PlusIcon from "./svg's/plus"
import DeleteIcon from "./svg's/delete"
import EditIcon from "./svg's/edit"
import ReplyIcon from "./svg's/reply"
import { flushSync } from "react-dom";


export default function Comments({posts, currUser, onEditedComment, onAddReply, onEditedReply, onAskToDelete}) {
    let [active, setActive] = useState(0)
    function handleOnActive(id) {
        setActive(id)
    }

    let Posts_compo = posts.map(per=>{
        let isCurrUser = per.user.username===currUser.username
        return <Comment 
                    key={per.id} 
                    currUser={currUser}
                    commentData={per}
                    isOnReply={active}
                    isOnEdit={active}
                    handleIsOnReply={handleOnActive}
                    handleIsOnEdit={handleOnActive}
                    isCurrUser={isCurrUser}
                    onEdited={onEditedComment}
                    repliesBelong={per.id}
                    onAddReply={onAddReply}
                    onEditedReply={onEditedReply}
                    onAskToDelete={onAskToDelete}
                />
    })
    return(
        <>
            {Posts_compo}
        </>
    )
}

function Comment({currUser, commentData, isCurrUser=false, isOnReply, isOnEdit, handleIsOnReply,handleIsOnEdit, onEdited, repliesBelong,onAddReply,onEditedReply,onAskToDelete}) {
    let [score, setScore] = useState(commentData.score)
    let [which, setWhich] = useState(undefined)

    let [editorText, setEditorText] = useState(commentData.content)
    let input = useRef(null)
    let editorInput = useRef(null)
    return(
        <div className='commentPost'>
            {/* user informations */}
            <div className="comment">

                <div className='userData'>

                    <div className="image">
                        <img src={commentData.user.image.png}/>
                    </div>

                    <h3 className="userName">{commentData.user.username}</h3>

                    {isCurrUser&&<span className="label_you">you</span>}

                    <p className="createdAt">{commentData.createdAt}</p>
                </div>
                
                {/* user comment score */}
                <div className="scoreCounter">
                    <span onClick={e=>{
                        if(!isCurrUser){
                            if(which===undefined||which==="minus"){
                                setScore(commentData.score+1)
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
                                setScore(commentData.score-1)
                                setWhich("minus")
                            }
                        }
                    }}>
                        <MinusIcon/>
                    </span>
                </div>

                {/* comment content */}
                <div className="content">
                    {
                        isCurrUser
                        ?(
                            <>
                                {
                                    !(isOnEdit===commentData.id)
                                    ?(<p>{commentData.content}</p>)
                                    :(
                                        <div className="editor">
                                            <textarea className='editContent' value={editorText} onInput={e=>setEditorText(e.target.value)} ref={editorInput}></textarea>
                                            <button className="action-btn" type="button" onClick={e=>{
                                                if(editorText!==""){
                                                    onEdited(editorText, commentData.id)
                                                    handleIsOnEdit(0)
                                                }
                                            }}>EDIT</button>
                                        </div>
                                    )
                                }
                                
                            </>
                        )
                        :(<p>{commentData.content}</p>)
                    }
                </div>

                {/* buttons */}
                <div className="buttons">
                    {
                        isCurrUser
                        ?(
                            <>
                                <button className="config-delete" onClick={e=>onAskToDelete(true,{forComm:true,id:commentData.id,})}><DeleteIcon/>Delete</button>
                                <button className="config-edit" onClick={()=>{
                                    flushSync(()=>{
                                        handleIsOnEdit(commentData.id!==isOnReply?commentData.id:0)
                                    })
                                    editorInput.current.focus()                            
                                }}><EditIcon/>Edit</button>
                            </>
                        )
                        :(<button className="config-reply" onClick={()=>{
                            flushSync(()=>{
                                handleIsOnReply(commentData.id!==isOnReply?commentData.id:0)
                            })
                            if(input.current!==null){
                                input.current.focus();                            
                            }
                        }}><ReplyIcon/>Reply</button>)
                    }
                </div>
                
            </div>


            {
                !isCurrUser
                &&
                <>
                    {isOnReply===commentData.id&&<Initiator currUser={currUser} replyingTo={commentData} onAddReply={onAddReply} repliesBelong={repliesBelong} handleIsOnReply={handleIsOnReply} ref={input}/>}
                    {commentData.replies.length>0&&<Replies replies={commentData.replies} currUser={currUser} isOnReply={isOnReply} isOnEdit={isOnEdit} handleIsOnEdit={handleIsOnEdit} handleIsOnReply={handleIsOnReply} repliesBelong={repliesBelong} onAddReply={onAddReply} onEditedReply={onEditedReply} onAskToDelete={onAskToDelete}/>}
                </>
            }
        </div>
    )
}