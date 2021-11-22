class Message {
    constructor(author, channel, content, bg_url) {
        let date = new Date();
        date = date.toLocaleString("en-US", {timeZone: "America/New_York"});
        this.author = author.member;
        this.content = content;
        this.bg_url = author.member.settings.bg_url;
        this.timestamp = date;
        this.channel = channel.channel;
    }
}

export {Message};