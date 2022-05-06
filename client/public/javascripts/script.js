let data;

/*
let config;
fetch("/config").then((res) => {
    return res.json();
}).then((data) => {
    config = data;

    return fetch("http://" + config.server);    
});
*/

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
    fetch("/data").then((res) => {
        return res.json();
    }).then((_data) => {
        data = _data;
        data.forEach((obj) => {
            allChats.set(obj.username, new ChatWithUser(obj));
        });
    });

    window.onkeydown = (ev) => {
        if (ev.key == "Escape") setCurrentChat();
        
        if (ev.key == "Control") {
            fetch("/users").then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
            });
        }
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