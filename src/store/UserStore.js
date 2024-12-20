class UserStore {
  constructor() {
    if (!UserStore.instance) {
      this.users = [];
      this.onlineUsers = [];
      UserStore.instance = this;
    }

    return UserStore.instance;
  }

  getUsers() {
    return this.users;
  }

  addUser(user) {
    this.users.push(user);
  }

  getOnlineUsers() {
    return this.onlineUsers;
  }

  addOnlineUser(username, socketId) {
    this.onlineUsers.push(username, socketId);
  }

  removeOnlineUser(username) {
    this.onlineUsers.delete(username);
  }
}

// Make sure the instance is the same across the app
const userStore = new UserStore();
Object.freeze(userStore);

module.exports = userStore;
