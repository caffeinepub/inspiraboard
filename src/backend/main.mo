import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Set "mo:core/Set";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Roles & Authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // File/Blob Storage
  include MixinStorage();

  // Types
  public type Author = {
    id : Principal;
    displayName : Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    displayName : Text;
    avatar : ?Storage.ExternalBlob;
    bio : Text;
  };

  public type PostMetadata = {
    id : Text;
    author : Author;
    caption : Text;
    image : Storage.ExternalBlob;
    createdAt : Time.Time;
    tags : [Text];
  };

  public type Message = {
    id : Nat;
    sender : Principal;
    recipient : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  // Data Storage
  let posts = List.empty<PostMetadata>();
  let conversations = Map.empty<Principal, List.List<Message>>();

  // User Profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Post compare functions for sorting
  module PostMetadata {
    public func compare(post1 : PostMetadata, post2 : PostMetadata) : Order.Order {
      Text.compare(post1.id, post2.id);
    };

    public func compareByTimestampDesc(post1 : PostMetadata, post2 : PostMetadata) : Order.Order {
      switch (Int.compare(post2.createdAt, post1.createdAt)) {
        case (#equal) { compare(post1, post2) };
        case (order) { order };
      };
    };
  };

  // Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Anyone can view other users' profiles (public social network)
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Feeds/Videos
  // Return all posts (reverse chronological)
  public query func getFeed() : async [PostMetadata] {
    posts.toArray().sort(PostMetadata.compareByTimestampDesc);
  };

  // Add a new post
  public shared ({ caller }) func addPost(caption : Text, image : Storage.ExternalBlob, tags : [Text]) : async PostMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found. Please create a profile first.") };
      case (?p) { p };
    };

    let author : Author = {
      id = caller;
      displayName = profile.displayName;
      avatar = profile.avatar;
    };

    let post : PostMetadata = {
      id = "post-" # posts.size().toText();
      author;
      caption;
      image;
      createdAt = Time.now();
      tags;
    };

    posts.add(post);
    post;
  };

  // Get all unique tags
  public query func getAllTags() : async [Text] {
    posts.toArray().flatMap(
      func(post) {
        post.tags.values();
      }
    );
  };

  // Search posts by caption or tags
  public query func searchPosts(term : Text, tag : ?Text) : async [PostMetadata] {
    posts.toArray().filter(
      func(post) {
        let textMatches = post.caption.contains(#text term);
        let tagMatches = switch (tag) {
          case (null) { false };
          case (?t) {
            post.tags.filter(
              func(postTag) {
                Text.equal(postTag, t);
              }
            ).size() > 0;
          };
        };
        textMatches or tagMatches;
      }
    ).sort();
  };

  // Messaging
  // Send a new message
  public shared ({ caller }) func sendMessage(to : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let message : Message = {
      id = Time.now().toNat();
      sender = caller;
      recipient = to;
      content;
      timestamp = Time.now();
    };

    let existingMessages = switch (conversations.get(to)) {
      case (null) {
        let newList = List.empty<Message>();
        conversations.add(to, newList);
        newList;
      };
      case (?messagesList) { messagesList };
    };

    existingMessages.add(message);
  };

  // Get messages for conversation
  public query ({ caller }) func getMessages(otherUser : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (conversations.get(otherUser)) {
      case (null) { [] };
      case (?messagesList) {
        // Filter to only return messages where caller is sender or recipient
        messagesList.toArray().filter(
          func(msg : Message) : Bool {
            (msg.sender == caller and msg.recipient == otherUser) or
            (msg.sender == otherUser and msg.recipient == caller)
          }
        );
      };
    };
  };
};
