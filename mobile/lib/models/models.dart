class User {
  final int id;
  final String email;
  final String fullName;
  final String role; // 'worshiper' or 'leader'
  final String? faith;
  final String? bio;
  final String? profilePhoto;
  final DateTime? createdAt;
  final int? followersCount;
  final int? postsCount;
  final bool? isFollowing;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.faith,
    this.bio,
    this.profilePhoto,
    this.createdAt,
    this.followersCount,
    this.postsCount,
    this.isFollowing,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      fullName: json['fullName'],
      role: json['role'],
      faith: json['faith'],
      bio: json['bio'],
      profilePhoto: json['profilePhoto'],
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      followersCount: json['followersCount'],
      postsCount: json['postsCount'],
      isFollowing: json['isFollowing'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'role': role,
      'faith': faith,
      'bio': bio,
      'profilePhoto': profilePhoto,
      'createdAt': createdAt?.toIso8601String(),
      'followersCount': followersCount,
      'postsCount': postsCount,
      'isFollowing': isFollowing,
    };
  }

  bool get isLeader => role == 'leader';
  bool get isWorshiper => role == 'worshiper';
}

class Post {
  final int id;
  final String? caption;
  final String? mediaUrl;
  final String? mediaType;
  final int likesCount;
  final int commentsCount;
  final DateTime createdAt;
  final bool isLiked;
  final bool isSaved;
  final PostAuthor author;

  Post({
    required this.id,
    this.caption,
    this.mediaUrl,
    this.mediaType,
    required this.likesCount,
    required this.commentsCount,
    required this.createdAt,
    required this.isLiked,
    required this.isSaved,
    required this.author,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      caption: json['caption'],
      mediaUrl: json['mediaUrl'],
      mediaType: json['mediaType'],
      likesCount: json['likesCount'] ?? 0,
      commentsCount: json['commentsCount'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      isLiked: json['isLiked'] ?? false,
      isSaved: json['isSaved'] ?? false,
      author: PostAuthor.fromJson(json['author']),
    );
  }
}

class PostAuthor {
  final int id;
  final String name;
  final String? photo;
  final String role;
  final String? faith;

  PostAuthor({
    required this.id,
    required this.name,
    this.photo,
    required this.role,
    this.faith,
  });

  factory PostAuthor.fromJson(Map<String, dynamic> json) {
    return PostAuthor(
      id: json['id'],
      name: json['name'],
      photo: json['photo'],
      role: json['role'],
      faith: json['faith'],
    );
  }
}

class Reel {
  final int id;
  final String? caption;
  final String videoUrl;
  final String? thumbnailUrl;
  final int likesCount;
  final int commentsCount;
  final int viewsCount;
  final DateTime createdAt;
  final bool isLiked;
  final bool isSaved;
  final PostAuthor author;

  Reel({
    required this.id,
    this.caption,
    required this.videoUrl,
    this.thumbnailUrl,
    required this.likesCount,
    required this.commentsCount,
    required this.viewsCount,
    required this.createdAt,
    required this.isLiked,
    required this.isSaved,
    required this.author,
  });

  factory Reel.fromJson(Map<String, dynamic> json) {
    return Reel(
      id: json['id'],
      caption: json['caption'],
      videoUrl: json['videoUrl'],
      thumbnailUrl: json['thumbnailUrl'],
      likesCount: json['likesCount'] ?? 0,
      commentsCount: json['commentsCount'] ?? 0,
      viewsCount: json['viewsCount'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      isLiked: json['isLiked'] ?? false,
      isSaved: json['isSaved'] ?? false,
      author: PostAuthor.fromJson(json['author']),
    );
  }
}

class AppNotification {
  final int id;
  final String type;
  final String content;
  final bool isRead;
  final DateTime createdAt;
  final NotificationUser? relatedUser;
  final int? relatedPostId;
  final int? relatedReelId;

  AppNotification({
    required this.id,
    required this.type,
    required this.content,
    required this.isRead,
    required this.createdAt,
    this.relatedUser,
    this.relatedPostId,
    this.relatedReelId,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'],
      type: json['type'],
      content: json['content'],
      isRead: json['isRead'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
      relatedUser: json['relatedUser'] != null 
          ? NotificationUser.fromJson(json['relatedUser']) 
          : null,
      relatedPostId: json['relatedPostId'],
      relatedReelId: json['relatedReelId'],
    );
  }
}

class NotificationUser {
  final int id;
  final String name;
  final String? photo;

  NotificationUser({
    required this.id,
    required this.name,
    this.photo,
  });

  factory NotificationUser.fromJson(Map<String, dynamic> json) {
    return NotificationUser(
      id: json['id'],
      name: json['name'],
      photo: json['photo'],
    );
  }
}

class Message {
  final int id;
  final String content;
  final bool isRead;
  final DateTime createdAt;
  final MessageUser sender;
  final MessageUser receiver;
  final bool isMine;

  Message({
    required this.id,
    required this.content,
    required this.isRead,
    required this.createdAt,
    required this.sender,
    required this.receiver,
    required this.isMine,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      content: json['content'],
      isRead: json['isRead'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
      sender: MessageUser.fromJson(json['sender']),
      receiver: MessageUser.fromJson(json['receiver']),
      isMine: json['isMine'] ?? false,
    );
  }
}

class MessageUser {
  final int id;
  final String name;
  final String? photo;

  MessageUser({
    required this.id,
    required this.name,
    this.photo,
  });

  factory MessageUser.fromJson(Map<String, dynamic> json) {
    return MessageUser(
      id: json['id'],
      name: json['name'],
      photo: json['photo'],
    );
  }
}

class Conversation {
  final int userId;
  final String userName;
  final String? userPhoto;
  final String userRole;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;

  Conversation({
    required this.userId,
    required this.userName,
    this.userPhoto,
    required this.userRole,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.unreadCount,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      userId: json['userId'],
      userName: json['userName'],
      userPhoto: json['userPhoto'],
      userRole: json['userRole'],
      lastMessage: json['lastMessage'],
      lastMessageTime: DateTime.parse(json['lastMessageTime']),
      unreadCount: json['unreadCount'] ?? 0,
    );
  }
}

class Comment {
  final int id;
  final String content;
  final DateTime createdAt;
  final CommentAuthor author;

  Comment({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.author,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'],
      content: json['content'],
      createdAt: DateTime.parse(json['createdAt']),
      author: CommentAuthor.fromJson(json['author']),
    );
  }
}

class CommentAuthor {
  final int id;
  final String name;
  final String? photo;

  CommentAuthor({
    required this.id,
    required this.name,
    this.photo,
  });

  factory CommentAuthor.fromJson(Map<String, dynamic> json) {
    return CommentAuthor(
      id: json['id'],
      name: json['name'],
      photo: json['photo'],
    );
  }
}
