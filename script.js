let data = [
    {
        "username": "First User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "1st message"
            },
            {
                "sent": true,
                "text": "2nd message"
            },
            {
                "sent": false,
                "text": "3rd message"
            }
        ]
    },
    {
        "username": "Second User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "4th message"
            },
            {
                "sent": false,
                "text": "5th message"
            },
            {
                "sent": false,
                "text": "6th message"
            }
        ]
    },
    {
        "username": "Third User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "7th message"
            },
            {
                "sent": false,
                "text": "8th message"
            },
            {
                "sent": true,
                "text": "9th message"
            }
        ]
    }
];

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
    document.getElementById("chatlist").appendChild(this.chat.htmlBlock);

    this.conversation = {
        htmlBlock: createConversation(obj),
        show: function () {
            document.body.appendChild(this.htmlBlock);
        },
        hide: function () {
            document.body.removeChild(this.htmlBlock);
        }
    };

    this.chat.htmlBlock.onclick = () => {
        setCurrentChat(this);
    };
}

window.onload = function () {
    data.forEach((obj) => {
        allChats.set(obj.username, new ChatWithUser(obj));
    });

    window.onkeydown = (ev) => {
        if (ev.key == "Escape") setCurrentChat();
    };
    /*
    var messages = document.getElementById("messages");

    var longText = "Text";
    for (var i = 0; i < 50; i++)
        longText += " text";

    messages.appendChild(generateMessage(true, longText));
    messages.appendChild(generateMessage(false, longText));
    messages.appendChild(generateMessage(false, longText));
    for (let i = 0; i < 17; i++)
        messages.appendChild(generateMessage(true, String(i) + "msg"));

    var chatList = document.getElementById("chatlist");
    for (let i = 0; i < 14; i++)
        chatList.appendChild(createUser({
            profilePic: "profile_pic.png",
            username: "user" + i,
            lastMessage: "Message text"
        }));
    */
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