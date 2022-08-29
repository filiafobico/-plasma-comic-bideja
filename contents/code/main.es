function init() {
  comic.comicAuthor = "Clara Gomes"
  comic.websiteUrl = "http://bichinhosdejardim.com/"

  if (comic.identifier) {
    comic.requestPage(comic.websiteUrl + comic.identifier, comic.Page)
  } else {
    comic.requestPage(comic.websiteUrl, comic.User)
  }
}

function pageRetrieved(id, html) {
  if (id == comic.User) {
    comic.lastIdentifier = findLastComicIdentifier(html)
    comic.requestPage(comic.websiteUrl + comic.lastIdentifier, comic.Page)
  }

  if (id == comic.Page) {
    getAndSetComicInfo(html)
  }
}

function findLastComicIdentifier(html) {
  var regexOfLastComic = /post-title([\\"><]+)a\shref=([\\"><]+)http:\/\/bichinhosdejardim\.com\/([\w-]+)/
  var match = html.match(regexOfLastComic)

  if (match && match.length) {
    return match.reverse()[0]
  }
}

function getAndSetComicInfo(html) {
  var shopUrl = findComicImage(html)
  if (!shopUrl) return false

  var previousIdentifier = findPrevComicIdentifier(html)
  if (previousIdentifier) {
    comic.previousIdentifier = previousIdentifier
  }

  var nextIdentifier = findNextComicIdentifier(html)
  if (nextIdentifier) {
    comic.nextIdentifier = nextIdentifier
  }

  comic.shopUrl = shopUrl
  comic.requestPage(comic.shopUrl, comic.Image)
  comic.title = comic.identifier.replace(/[^\w\d]/g, ' ').replace(/\b(\w)/g, (letter) => letter.toUpperCase())
}

function findNextComicIdentifier(html) {
  var regexOfNextComic =
    /blognav-next([\\"><]+)a\shref=([\\"><]+)http:\/\/bichinhosdejardim\.com\/([\w-]+)/
  var match = regexOfNextComic.exec(html)

  if (match && match.length) {
    return match.reverse()[0]
  }
}

function findPrevComicIdentifier(html) {
  var regexOfPrevComic =
    /blognav-prev([\\"><]+)a\shref=([\\"><]+)http:\/\/bichinhosdejardim\.com\/([\w-]+)/
  var match = regexOfPrevComic.exec(html)

  if (match && match.length) {
    return match.reverse()[0]
  }
}

function findComicImage(html) {
  var regexOfComicImage =
    /http:\/\/bichinhosdejardim\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[\w-]+\.png/
  var match = regexOfComicImage.exec(html)

  if (match && match.length) {
    return match[0]
  }
}
