import gradio as gr
import requests
import json
import os
from datetime import datetime
from typing import List, Tuple, Optional
import tempfile
import uuid

# Configuration
API_BASE_URL = "http://localhost:8000"  

class HRChatbotUI:
    def __init__(self):
        self.current_session_id = None
        self.chat_history = []
        
    def upload_resume(self, file) -> Tuple[str, str]:
        """Upload resume and return status message and session ID"""
        if file is None:
            return "Please select a PDF file to upload.", ""
        
        try:
            # Generate new session ID
            session_id = str(uuid.uuid4())
            
            # Prepare files for upload
            files = {"file": (file.name, open(file.name, "rb"), "application/pdf")}
            data = {"session_id": session_id}
            
            # Upload to API
            response = requests.post(f"{API_BASE_URL}/upload-resume", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                self.current_session_id = result["session_id"]
                self.chat_history = []
                return f"Resume uploaded successfully! Session ID: {result['session_id'][:8]}...\nChunks created: {result['chunks_created']}", result["session_id"]
            else:
                return f"Error uploading resume: {response.text}", ""
                
        except Exception as e:
            return f"Error: {str(e)}", ""
    
    def start_interview(self, session_id: str) -> Tuple[List[Tuple[str, str]], str]:
        """Start the interview and return initial greeting"""
        if not session_id:
            return [], "Please upload a resume first."
        
        try:
            # Get initial greeting from the chatbot
            initial_message = "Hello! I'm ready to start the interview."
            chat_response = self.send_message(initial_message, session_id)
            
            if chat_response:
                self.chat_history = [(initial_message, chat_response)]
                return self.chat_history, ""
            else:
                return [], "Error starting interview. Please try again."
                
        except Exception as e:
            return [], f"Error: {str(e)}"
    
    def send_message(self, message: str, session_id: str) -> str:
        """Send message to the chatbot API"""
        if not session_id:
            return "Please upload a resume and start the interview first."
        
        try:
            payload = {
                "message": message,
                "session_id": session_id
            }
            
            response = requests.post(f"{API_BASE_URL}/chat", json=payload)
            
            if response.status_code == 200:
                result = response.json()
                return result["response"]
            else:
                return f"Error: {response.text}"
                
        except Exception as e:
            return f"Error: {str(e)}"
    
    def chat_interface(self, message: str, history: List[Tuple[str, str]], session_id: str) -> Tuple[List[Tuple[str, str]], str]:
        """Handle chat interface interactions"""
        if not session_id:
            return history, "Please upload a resume first."
        
        if not message.strip():
            return history, ""
        
        # Get response from API
        bot_response = self.send_message(message, session_id)
        
        # Update history
        history.append((message, bot_response))
        
        return history, ""
    
    def get_session_info(self, session_id: str) -> str:
        """Get session information"""
        if not session_id:
            return "No active session"
        
        try:
            response = requests.get(f"{API_BASE_URL}/sessions/{session_id}")
            if response.status_code == 200:
                data = response.json()
                return f"""
**Session Information:**
- Session ID: {session_id[:8]}...
- Created: {data['created_at']}
- Resume Uploaded: {'Done' if data['resume_uploaded'] else 'Error'}
- Messages: {data['message_count']}
                """
            else:
                return "Error fetching session info"
        except Exception as e:
            return f"Error: {str(e)}"
    
    def reset_session(self, session_id: str) -> Tuple[List[Tuple[str, str]], str]:
        """Reset the current session"""
        if not session_id:
            return [], "No active session to reset"
        
        try:
            response = requests.post(f"{API_BASE_URL}/sessions/{session_id}/reset")
            if response.status_code == 200:
                self.chat_history = []
                return [], "Session reset successfully! You can start a new conversation."
            else:
                return [], f"Error resetting session: {response.text}"
        except Exception as e:
            return [], f"Error: {str(e)}"
    
    def process_voice_input(self, audio_file, session_id: str) -> Tuple[str, str]:
        """Process voice input and return transcription and response"""
        if not session_id:
            return "", "Please upload a resume first."
        
        if audio_file is None:
            return "", "Please record some audio first."
        
        try:
            # Prepare files for upload
            files = {"audio_file": (audio_file.name, open(audio_file.name, "rb"), "audio/wav")}
            data = {"session_id": session_id}
            
            response = requests.post(f"{API_BASE_URL}/voice-chat", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                return result["transcribed_text"], result["response"]
            else:
                return "", f"Error processing voice: {response.text}"
                
        except Exception as e:
            return "", f"Error: {str(e)}"
    
    def get_all_sessions(self) -> str:
        """Get all active sessions"""
        try:
            response = requests.get(f"{API_BASE_URL}/sessions")
            if response.status_code == 200:
                sessions = response.json()
                if not sessions:
                    return "No active sessions"
                
                session_info = "**Active Sessions:**\n"
                for session in sessions:
                    session_info += f"- {session['session_id'][:8]}... (Created: {session['created_at']}, Messages: {session['message_count']})\n"
                return session_info
            else:
                return "Error fetching sessions"
        except Exception as e:
            return f"Error: {str(e)}"

# Initialize the UI class
ui = HRChatbotUI()

# Create the Gradio interface
with gr.Blocks(title="HR Interview Chatbot", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # HR Interview Chatbot
    
    Welcome to the AI-powered HR Interview Chatbot! This tool helps you practice job interviews by analyzing your resume and asking relevant questions.
    
    ## How to use:
    1. **Upload your resume** (PDF format only)
    2. **Start the interview** by clicking the button
    3. **Chat with the HR bot** using text or voice
    4. **Practice and improve** your interview skills!
    """)
    
    with gr.Row():
        with gr.Column(scale=2):
            # Resume Upload Section
            with gr.Group():
                gr.Markdown("### 📄 Step 1: Upload Resume")
                resume_file = gr.File(
                    label="Upload Resume (PDF only)",
                    file_types=[".pdf"],
                    type="filepath"
                )
                upload_btn = gr.Button("Upload Resume", variant="primary")
                upload_status = gr.Textbox(
                    label="Upload Status",
                    interactive=False,
                    lines=3
                )
            
            # Session Info Section
            with gr.Group():
                gr.Markdown("### Session Information")
                session_id_display = gr.Textbox(
                    label="Current Session ID",
                    interactive=False,
                    visible=False
                )
                session_info_display = gr.Markdown("No active session")
                
                with gr.Row():
                    refresh_info_btn = gr.Button("Refresh Info")
                    reset_btn = gr.Button("Reset Session", variant="secondary")
                    all_sessions_btn = gr.Button("View All Sessions")
        
        with gr.Column(scale=3):
            # Chat Interface Section
            with gr.Group():
                gr.Markdown("### Step 2: Interview Chat")
                
                chatbot = gr.Chatbot(
                    label="HR Interview Chat",
                    height=400,
                    show_label=True,
                    avatar_images=["👤", "🤖"]
                )
                
                with gr.Row():
                    msg_input = gr.Textbox(
                        label="Your Message",
                        placeholder="Type your message here...",
                        lines=2,
                        scale=4
                    )
                    send_btn = gr.Button("Send", variant="primary", scale=1)
                
                start_interview_btn = gr.Button("Start Interview", variant="primary", size="lg")
    
    # Voice Input Section
    with gr.Group():
        gr.Markdown("### 🎤 Voice Input (Optional)")
        with gr.Row():
            audio_input = gr.Audio(
                label="Record your voice",
                type="filepath",
                sources=["microphone"]
            )
            process_voice_btn = gr.Button("Process Voice", variant="secondary")
        
        with gr.Row():
            voice_transcription = gr.Textbox(
                label="Transcribed Text",
                interactive=False,
                lines=2
            )
            voice_response = gr.Textbox(
                label="Bot Response",
                interactive=False,
                lines=3
            )
    
    # Advanced Options
    with gr.Accordion("Advanced Options", open=False):
        gr.Markdown("### API Configuration")
        api_url_input = gr.Textbox(
            label="API Base URL",
            value=API_BASE_URL,
            placeholder="http://localhost:8000"
        )
        test_connection_btn = gr.Button("Test API Connection")
        connection_status = gr.Textbox(
            label="Connection Status",
            interactive=False
        )
    
    # Hidden state for session management
    session_id_state = gr.State("")
    
    # Event handlers
    def upload_and_update(file):
        status, session_id = ui.upload_resume(file)
        session_info = ui.get_session_info(session_id) if session_id else "No active session"
        return status, session_id, session_id, session_info
    
    def start_interview_and_update(session_id):
        if not session_id:
            return [], "Please upload a resume first.", session_id
        history, msg = ui.start_interview(session_id)
        return history, msg, session_id
    
    def chat_and_update(message, history, session_id):
        new_history, msg = ui.chat_interface(message, history, session_id)
        return new_history, "", session_id
    
    def process_voice_and_update(audio, session_id):
        transcription, response = ui.process_voice_input(audio, session_id)
        return transcription, response
    
    def refresh_session_info(session_id):
        return ui.get_session_info(session_id)
    
    def reset_and_update(session_id):
        history, msg = ui.reset_session(session_id)
        return history, msg, session_id
    
    def test_api_connection(api_url):
        try:
            response = requests.get(f"{api_url}/health")
            if response.status_code == 200:
                return "API connection successful!"
            else:
                return f"API connection failed: {response.status_code}"
        except Exception as e:
            return f"API connection error: {str(e)}"
    
    # Connect event handlers
    upload_btn.click(
        upload_and_update,
        inputs=[resume_file],
        outputs=[upload_status, session_id_state, session_id_display, session_info_display]
    )
    
    start_interview_btn.click(
        start_interview_and_update,
        inputs=[session_id_state],
        outputs=[chatbot, msg_input, session_id_state]
    )
    
    send_btn.click(
        chat_and_update,
        inputs=[msg_input, chatbot, session_id_state],
        outputs=[chatbot, msg_input, session_id_state]
    )
    
    msg_input.submit(
        chat_and_update,
        inputs=[msg_input, chatbot, session_id_state],
        outputs=[chatbot, msg_input, session_id_state]
    )
    
    process_voice_btn.click(
        process_voice_and_update,
        inputs=[audio_input, session_id_state],
        outputs=[voice_transcription, voice_response]
    )
    
    refresh_info_btn.click(
        refresh_session_info,
        inputs=[session_id_state],
        outputs=[session_info_display]
    )
    
    reset_btn.click(
        reset_and_update,
        inputs=[session_id_state],
        outputs=[chatbot, upload_status, session_id_state]
    )
    
    all_sessions_btn.click(
        ui.get_all_sessions,
        outputs=[session_info_display]
    )
    
    test_connection_btn.click(
        test_api_connection,
        inputs=[api_url_input],
        outputs=[connection_status]
    )

if __name__ == "__main__":
    print("API @ http://localhost:8000")
    print("Gradio @ http://localhost:7860")
    
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        debug=True
    )