
import { SentenceQuestion } from './types';

export const SENTENCE_TIME_LIMIT = 360; // 6 minutes
export const PRACTICE_1_QUESTIONS: SentenceQuestion[] = [
  {
    id: 1,
    context: "Where did you get your shoes?",
    scrambledWords: ["visited", "had", "last month", "the shop", "a sale", "I"],
    correctAnswer: "the shop I visited last month had a sale",
    suffix: ".",
    explanation: "This sentence uses a relative clause 'I visited last month' to describe 'the shop'. The subject is 'the shop I visited last month' and the verb is 'had'."
  },
  {
    id: 2,
    context: "The workshop yesterday was very informative.",
    scrambledWords: ["another one", "do", "there", "if", "be", "you know", "will"],
    correctAnswer: "do you know if there will be another one",
    suffix: " soon?",
    explanation: "This is a direct question beginning with 'Do you know', followed by an indirect question 'if there will be another one'."
  },
  {
    id: 3,
    context: "The new restaurant downtown has amazing reviews.",
    scrambledWords: ["know", "do", "if", "vegetarian options", "have", "you", "they"],
    correctAnswer: "do you know if they have vegetarian options",
    suffix: "?",
    explanation: "Similar to the previous question, this is an indirect question embedded within 'Do you know if...?'"
  },
  {
    id: 4,
    context: "That was a great movie we watched last night.",
    prefix: "",
    scrambledWords: ["that", "by", "director", "would", "like", "another film", "to see", "you"],
    correctAnswer: "would you like to see another film by that director",
    suffix: "?",
    explanation: "This uses the 'would you like to + verb' structure for polite offers or invitations."
  },
  {
    id: 5,
    context: "I’m planning to visit my grandparents next weekend.",
    scrambledWords: ["to the airport", "tell me", "you", "can", "need", "a lift", "whether"],
    correctAnswer: "can you tell me whether you need a lift to the airport",
    fixedWords: { 1: "you" },
    suffix: "?",
    explanation: "This sentence uses 'Can you tell me' followed by an indirect question with 'whether'. Note that there are two 'you's in the full sentence."
  },
  {
    id: 6,
    context: "The book you lent me was fascinating.",
    scrambledWords: ["do", "you know", "if", "the author", "has", "other books"],
    correctAnswer: "do you know if the author has written other books",
    fixedWords: { 5: "written" },
    suffix: "?",
    explanation: "This is an indirect question: 'Do you know if...' followed by a present perfect structure 'the author has written...'."
  },
  {
    id: 7,
    context: "The new software update looks promising.",
    prefix: "On",
    scrambledWords: ["which", "website", "were you", "able", "to find", "the download"],
    correctAnswer: "which website were you able to find the download",
    suffix: "?" ,
    explanation: "This is a question starting with a prepositional phrase 'On which website...'"
  },
  {
    id: 8,
    context: "The new coffee shop downtown is very popular.",
    prefix: "Is",
    scrambledWords: ["that", "the one", "where", "you can", "watch", "football matches", "on screen"],
    correctAnswer: "that the one where you can watch football matches on screen",
    suffix: "?",
    explanation: "This uses a relative clause starting with 'where' to describe 'the one' (the coffee shop)."
  },
  {
    id: 9,
    context: "We had a great time at the concert last night.",
    scrambledWords: ["how", "find out", "can we", "when", "is performing", "that band", "again"],
    correctAnswer: "how can we find out when that band is performing again",
    suffix: "?",
    explanation: "This is an indirect question 'when that band is performing again' inside a direct question starting with 'How can we...'."
  },
  {
    id: 10,
    context: "I really enjoyed the hiking trip last weekend.",
    scrambledWords: ["can", "tell me", "you", "if", "more trips", "there are", "planned"],
    correctAnswer: "can you tell me if there are more trips planned",
    suffix: " for this month?",
    explanation: "An indirect question structure: 'Can you tell me if there are...'"
  }
];

export const PRACTICE_2_QUESTIONS: SentenceQuestion[] = [
  {
    id: 11,
    context: "I’m planning a surprise party for my roommate.",
    prefix: "What a coincidence—",
    scrambledWords: ["for", "the", "same", "as", "I'm", "doing"],
    correctAnswer: "I'm doing the same for",
    suffix: " my roommate.",
    explanation: "This sentence means 'I am doing the same thing for my roommate too'. The word 'as' is not needed in this specific sentence structure.",
    correctSegmentCount: 5
  },
  {
    id: 12,
    context: "How are your Polish lessons going?",
    prefix: "I’m actually learning on my own ",
    scrambledWords: ["to", "that", "simulate", "uses AI", "with an app", "how"],
    correctAnswer: "with an app that uses AI to simulate",
    suffix: " conversations.",
    explanation: "The sentence uses a relative clause starting with 'that' to describe the 'app'. The word 'how' is a distractor.",
    correctSegmentCount: 5
  },
  {
    id: 13,
    context: "Tonight, I’m going to try the new restaurant right across from campus.",
    scrambledWords: ["with", "from", "went", "I", "the hiking club", "try", "my friends"],
    correctAnswer: "I went last week with my friends from the hiking club",
    fixedWords: { 2: "last week" },
    suffix: ".",
    explanation: "This sentence uses the past simple 'went'. 'last week' is fixed as a time marker. 'with' and 'from' help define the relationship between the speaker and the hiking club. 'try' is a distractor.",
    correctSegmentCount: 7
  },
  {
    id: 14,
    context: "I have to finish my homework before dinner.",
    scrambledWords: ["subjects", "assignments in", "you", "have", "do", "what"],
    correctAnswer: "what subjects do you have assignments in",
    suffix: "?",
    explanation: "Grammar Note: This question asks about the specific subjects you have work for. In English, it's common to place the preposition 'in' at the end of such questions."
  },
  {
    id: 15,
    context: "I need to pick up some groceries after class.",
    scrambledWords: ["you", "store", "going to", "are", "which"],
    correctAnswer: "which store are you going to",
    suffix: "?",
    explanation: "A common question structure using 'which' to ask for a choice among options."
  },
  {
    id: 16,
    context: "The student association is organizing a charity event next month.",
    prefix: "I ",
    scrambledWords: ["organize", "the children’s", "support", "will", "hospital", "hear"],
    fixedWords: { 1: "the event" },
    correctAnswer: "hear the event will support the children’s hospital",
    suffix: ".",
    explanation: "The word 'hear' introduces reported information, and 'will support' describes the purpose of the event. 'organize' is a distractor.",
    correctSegmentCount: 6
  },
  {
    id: 17,
    context: "I’m thinking about redecorating my dorm room.",
    scrambledWords: ["you", "are", "considering", "what", "style"],
    correctAnswer: "what style are you considering",
    suffix: "?",
    explanation: "Asking about preferences or plans using the present continuous 'are you considering'."
  },
  {
    id: 18,
    context: "I missed the lecture this morning.",
    scrambledWords: ["you", "get", "from", "notes", "did", "the"],
    correctAnswer: "did you get the notes from",
    suffix: " someone?",
    explanation: "A past simple question asking if an action was completed."
  },
  {
    id: 19,
    context: "I’m going to attend the career workshop on Sunday.",
    scrambledWords: ["there", "are", "any", "specific", "you’re", "skills", "hoping to"],
    correctAnswer: "are there any specific skills you’re hoping to",
    suffix: " gain?",
    explanation: "Using 'are there any' to inquire about the existence of specific items or goals."
  },
  {
    id: 20,
    context: "I have to prepare for the big presentation next week.",
    scrambledWords: ["your", "have", "finished", "creating", "slides", "you"],
    correctAnswer: "have you finished creating your slides",
    suffix: "?",
    explanation: "A present perfect question checking on the status of a task."
  }
];
