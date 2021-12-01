async function command(msg, io) {
    let user = await db.fetch(`user.${msg.author.id}`);
    if (!user.info.roles.includes('admin')) return;

    if (msg.content.startsWith('/create-user')) {
        let args = msg.content.split(' ');
        if (!(args[1] || args[2] || args[3])) return;
        await new User(args[1], args[2], args[3]);
    } else if (msg.content.startsWith('/delete-user')) {
        let args = msg.content.split(' ');
        if (!args[1]) return;
        if (!await db.fetch(`user.${args[1]}`)) return;
        
        await db.delete(`user.${args[1]}`);
    } 
}
module.exports = command;