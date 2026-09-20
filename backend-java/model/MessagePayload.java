package com.spamshield.model;

import java.util.List;

public class MessagePayload {
    private String id;
    private String type; // "email" or "sms"
    private String sender;
    private String subject;
    private String body;
    private String timestamp;

    public MessagePayload() {}

    public MessagePayload(String id, String type, String sender, String subject, String body, String timestamp) {
        this.id = id;
        this.type = type;
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
