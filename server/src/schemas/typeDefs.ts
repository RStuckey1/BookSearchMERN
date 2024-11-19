const typeDefs = `
  type User {
    _id: ID
    name: String
    email: String
    password: String
  }

  type Auth {
    token: ID!
    user: User
  }
  
  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    user: [User]!
    user(UserId: ID!): User
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth

    saveBook(userId: ID!, bookId: String!): Profile
    removeProfile: Profile
    removeSkill(skill: String!): Profile
  }
`;

export default typeDefs;
