const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns an unmutated empty array, when passed an empty array", () => {
    const input = [{}];
    const actualOutput = formatDate(input);
    const expectedOutput = [{}];
    expect(actualOutput).to.not.eql(expectedOutput);
  });
  it("passed an array with one article obj, returns with the timestamp formatted as a date", () => {
    const input = [{ created_at: 1502921310430 }];
    const output = formatDate(input);
    const result = output[0].created_at;
    expect(result).to.be.an.instanceOf(Date);
  });
  it("passed an array with multiple articles, returns with the timestamp formatted as a date", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const output = formatDate(input);
    output.forEach(article => {
      expect(article.created_at).to.be.an.instanceOf(Date);
    });
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("can make one reference pair, using the title as the key & article_id as the value", () => {
    const input = [
      {
        article_id: 27,
        title: "Thanksgiving Drinks for Everyone",
        body:
          "Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, cranberry sauce, stuffing, and last but not least, a juicy turkey. Don’t let your meticulous menu fall short of perfection; flavorful cocktails are just as important as the meal. Here are a few ideas that will fit right into your festivities.",
        votes: 0,
        topic: "cooking",
        author: "grumpy19",
        created_at: "2017-04-23T18:00:55.514Z"
      }
    ];
    const expectedOutput = {
      "Thanksgiving Drinks for Everyone": 27
    };
    expect(makeRefObj(input)).to.eql(expectedOutput);
  });
  it("can make a reference object from an array of articles, using the title as the key & article_id as the value", () => {
    expect(
      makeRefObj([
        {
          article_id: 27,
          title: "Thanksgiving Drinks for Everyone",
          body:
            "Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, cranberry sauce, stuffing, and last but not least, a juicy turkey. Don’t let your meticulous menu fall short of perfection; flavorful cocktails are just as important as the meal. Here are a few ideas that will fit right into your festivities.",
          votes: 0,
          topic: "cooking",
          author: "grumpy19",
          created_at: "2017-04-23T18:00:55.514Z"
        },
        {
          article_id: 28,
          title: "test article",
          body:
            "Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, cranberry sauce, stuffing, and last but not least, a juicy turkey. Don’t let your meticulous menu fall short of perfection; flavorful cocktails are just as important as the meal. Here are a few ideas that will fit right into your festivities.",
          votes: 0,
          topic: "cooking",
          author: "sneezy89",
          created_at: "2017-05-23T18:00:55.514Z"
        }
      ])
    ).to.eql({ "Thanksgiving Drinks for Everyone": 27, "test article": 28 });
  });
});

describe("formatComments", () => {
  it("when passed empty arrays, returns an empty object", () => {
    const actualOutput = formatComments([], []);
    const expectedOutput = {};
    expect(actualOutput).to.not.eql(expectedOutput);
  });
  it("returns the updated comment object with 'articleId' replacing 'belongs_to", () => {
    const comments = [
      {
        body:
          "Delectus id consequatur voluptatem ad sapiente quia optio dolor. Dolorum est ullam vitae.",
        belongs_to: "test article",
        created_by: "grumpy19",
        votes: 0,
        created_at: 1474397182435
      }
    ];
    const articlesRefObj = { "test article": 28 };
    const actualOutput = formatComments(comments, articlesRefObj);
    expect(actualOutput[0]).to.haveOwnProperty("article_id");
  });
  it("returns updated comment with 'created_by' property changed to author", () => {
    const comments = [
      {
        body:
          "Delectus id consequatur voluptatem ad sapiente quia optio dolor. Dolorum est ullam vitae.",
        belongs_to: "test article",
        created_by: "grumpy19",
        votes: 0,
        created_at: 1474397182435
      }
    ];
    const articlesRef = { "test article": 28 };
    const actualOutput = formatComments(comments, articlesRef);
    expect(actualOutput[0]).to.haveOwnProperty("author");
    expect(actualOutput[0]).to.not.have.property("created_by");
  });
  it("returns updated created_at property as a javascript date object", () => {
    const comments = [
      {
        body:
          "Delectus id consequatur voluptatem ad sapiente quia optio dolor. Dolorum est ullam vitae.",
        belongs_to: "test article",
        created_by: "grumpy19",
        votes: 0,
        created_at: 1474397182435
      }
    ];
    const articlesRef = { "test article": 28 };
    const actualOutput = formatComments(comments, articlesRef);
    const expectedOutput = [
      {
        body:
          "Delectus id consequatur voluptatem ad sapiente quia optio dolor. Dolorum est ullam vitae.",
        article_id: 28,
        author: "grumpy19",
        votes: 0,
        created_at: new Date(1474397182435)
      }
    ];
    expect(actualOutput).to.eql(expectedOutput);
  });
});
