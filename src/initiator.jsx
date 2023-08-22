import { forwardRef, useImperativeHandle, useRef, useState } from "react"

const Initiator = forwardRef((props, ref)=>{
    let [text, setText] = useState("")
    let input = useRef(null)
    useImperativeHandle(ref,()=>{
        return{
            focus(){
                input.current.focus()
            }
        }
    },[])
    return(
        <div className="initiator">
            <div className="image">
                <img src={props.currUser.image.png}/>
            </div>
            <textarea className="content" value={text} onInput={e=>setText(e.target.value)} placeholder={"Add a " + (props.forComment?"comment":"reply")} ref={input}></textarea>
            <button className="action-btn" onClick={e=>{
                if(text!==""){
                    if(props.forComment){
                        props.onAddComment(text)
                    }else{
                        props.onAddReply(text, props.repliesBelong, props.replyingTo.user.username)
                    }
                    if(props.handleIsOnReply){
                        props.handleIsOnReply(0)
                    }
                    setText("")
                }
            }}>{props.forComment?"SEND":"REPLY"}</button>
        </div>
        
    )
})
export default Initiator