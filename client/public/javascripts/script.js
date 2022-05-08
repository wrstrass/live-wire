let data;

let allChats = new Map();
let currentOpenedChat = undefined;
function setCurrentChat (user) {
    if (user == currentOpenedChat) return;

    if (currentOpenedChat != undefined) {
        currentOpenedChat.chat.deactivate();
        currentOpenedChat.conversation.hide();
    }

    if (user != undefined) {
        user.chat.activate();
        user.conversation.show();
    }

    currentOpenedChat = user;
}

function ChatWithUser (obj) {
    this.data = obj;

    this.chat = {
        htmlBlock: createChat({
            username: obj.username,
            profilePic: obj.profilePicture,
            lastMessage: obj.messages[obj.messages.length - 1].text
        }),
        activate: function () {
            this.htmlBlock.style.backgroundColor = "rgba(255, 0, 0, 1)";
        },
        deactivate: function () {
            this.htmlBlock.style.backgroundColor = "";
        }
    };
    this.chat.htmlBlock.onclick = () => {
        setCurrentChat(this);
    };
    document.getElementById("chatlist").appendChild(this.chat.htmlBlock);

    this.conversation = {
        htmlBlock: createConversation(obj),
        show: function () {
            document.body.appendChild(this.htmlBlock);
        },
        hide: function () {
            document.body.removeChild(this.htmlBlock);
        },

        setParams: function () {
            this.messages = this.htmlBlock.querySelector("#messages");
            this.textarea = this.htmlBlock.querySelector("textarea");
            this.sendButton = this.htmlBlock.querySelector("#send_button");
        }
    };
    this.conversation.setParams();
    this.addMessage = function (sent, text) {
        this.conversation.messages.appendChild(createMessage(sent, text));
    }
    this.conversation.sendButton.onclick = () => {
        sendMessage(this.data.username, this.conversation.textarea.value);
    }
}

let socket = new WebSocket("ws://localhost:9000");
socket.onopen = function (ev) {
    console.log("WebSocket connected");
}
socket.onmessage = function (ev) {
    let obj = JSON.parse(ev.data);

    if (obj.type == "NewIncomingMessage") {
        if (allChats.get(obj.message.sender) == undefined) {
            alert("New Message Sender! Reload the page");
        }
        else {
            allChats.get(obj.message.sender).addMessage(false, obj.message.message);
        }
    }
}

window.onload = function () {
    fetch("/data").then((res) => {
        return res.json();
    }).then((_data) => {
        data = _data;
        data.forEach((obj) => {
            allChats.set(obj.username, new ChatWithUser(obj));
        });
    });

    let makeUsersRequest = true;

    window.onkeydown = (ev) => {
        if (ev.key == "Escape") setCurrentChat();
        
        if (ev.key == "Control") {
            if (makeUsersRequest) {
                makeUsersRequest = false;

                fetch("/users").then((res) => {
                    return res.json();
                }).then((data) => {
                    data = JSON.parse(data);
                    document.getElementById("blurWindow").style.display = "block";
                    document.getElementById("usersList").innerHTML = "";

                    data.forEach((username) => {
                        document.getElementById("usersList").appendChild(createUserInUserList(username));
                    })
                });
            }
        }
    };

    window.onkeyup = (ev) => {
        if (ev.key == "Control") {
            document.getElementById("blurWindow").style.display = "none";
            makeUsersRequest = true;
        }
    }
}

function createConversation (user) {
    let conversation = document.createElement("div");
    conversation.id = "conversation";

    let messages = document.createElement("div");
    messages.id = "messages";
    user.messages.forEach((msg) => {
        messages.appendChild(createMessage(msg.sent, msg.text));
    });

    conversation.appendChild(messages);
    conversation.innerHTML = 
        "<div id=\"current_user\"><h2>" + user.username + "</h2></div>"
        + conversation.innerHTML +
        "<div id=\"type_message\"><textarea name=\"\" id=\"\" cols=\"30\" rows=\"10\"></textarea>" +
        "<div id=\"send_button\"><p>Send</p></div></div>";

    return conversation;
}

function createMessage (sent, text) {
    var msg = document.createElement("div");
    msg.classList.add("message_container");
    if (sent)
        msg.classList.add("sent");
    else
        msg.classList.add("received");

    msg.innerHTML = "<p class=\"message\">" + text + "</p>";
    return msg;
}

function createChat (user) {
    let userChat = document.createElement("div");
    userChat.classList.add("chat");

    let profilePic = document.createElement("div");
    profilePic.classList.add("profile_picture");
    profilePic.style.backgroundImage = "url(\"" + user.profilePic + "\");";
    userChat.appendChild(profilePic);

    let username = document.createElement("h2");
    username.classList.add("username");
    username.innerHTML = user.username;
    userChat.appendChild(username);

    let lastMessage = document.createElement("p");
    lastMessage.classList.add("last_message");
    lastMessage.innerHTML = user.lastMessage;
    userChat.appendChild(lastMessage);

    return userChat;
}


function createUserInUserList (username) {
    let result = document.createElement("div");
    result.classList.add("user");
    result.innerHTML = "<h2>" + username + "</h2><h2 class=\"plus\">+</h2>";

    result.getElementsByClassName("plus")[0].onclick = function() {
        sendMessage(username, "Hi!");
    }

    return result;
}


function sendMessage (toWhom, message) {
    fetch("/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            receiver: toWhom,
            msg: message
        })
    });
}