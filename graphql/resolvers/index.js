const bcrypt = require("bcrypt");
const Event = require("../../models/event");
const User = require("../../models/user");

// const events = eventIds => {
//   return Event.find({ _id: { $in: eventIds } })
//     .then(events => {
//       return events.map(event => {
//         return {
//           ...event._doc,
//           _id: event.id,
//           date: new Date(event._doc.date).toISOString(),
//           creator: user.bind(this, event.creator)
//         };
//       });
//     })
//     .catch(err => {
//       throw err;
//     });
// };

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

// const user = userId => {
//   return User.findById(userId)
//     .then(user => {
//       return {
//         ...user._doc,
//         _id: user.id,
//         createdEvents: events.bind(this, user._doc.createdEvents)
//       };
//     })
//     .catch(err => {
//       throw err;
//     });
// };

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  // events: () => {
  //   return (
  //     Event.find()
  //       // .populate("creator")
  //       .then(events => {
  //         return events.map(event => {
  //           return {
  //             ...event._doc,
  //             _id: event.id,
  //             date: new Date(event._doc.date).toISOString(),
  //             creator: user.bind(this, event._doc.creator)
  //             // creator: {
  //             //   ...event._doc.creator._doc,
  //             //   _id: event._doc.creator.id
  //             // }
  //           };
  //         });
  //       })
  //       .catch(err => {
  //         throw err;
  //       })
  //   );
  // },
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  // createEvent: args => {
  //   const event = new Event({
  //     title: args.eventInput.title,
  //     description: args.eventInput.description,
  //     price: +args.eventInput.price,
  //     date: new Date(args.eventInput.date),
  //     creator: "6457d7cb260219574fd26c78"
  //   });
  //   let createdEvent;
  //   return event
  //     .save()
  //     .then(result => {
  //       createdEvent = {
  //         ...result._doc,
  //         _id: result._doc._id.toString(),
  //         date: new Date(event._doc.date).toISOString(),
  //         creator: user.bind(thid, result._doc.creator)
  //       };
  //       return User.findById("6457d7cb260219574fd26c78");
  //     })
  //     .then(user => {
  //       if (!user) {
  //         throw new Error("No user found.");
  //       }
  //       user.createdEvents.push(event);
  //       return user.save();
  //     })
  //     .then(result => {
  //       return createdEvent;
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       throw err;
  //     });
  // },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "6457d7cb260219574fd26c78"
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(thid, result._doc.creator)
      };
      const creator = await User.findById("6457d7cb260219574fd26c78");

      if (!creator) {
        throw new Error("No user found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // createUser: args => {
  //   return User.findOne({ email: args.userInput.email })
  //     .then(user => {
  //       if (user) {
  //         throw new Error("User already exists.");
  //       }
  //       return bcrypt.hash(args.userInput.password, 12);
  //     })
  //     .then(hashedPassword => {
  //       const user = new User({
  //         email: args.userInput.email,
  //         password: hashedPassword
  //       });
  //       return user.save();
  //     })
  //     .then(result => {
  //       return { ...result._doc, password: null, _id: result.id };
  //     })
  //     .catch(err => {
  //       throw err;
  //     });
  // }
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
