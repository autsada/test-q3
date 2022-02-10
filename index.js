let input

// Get the input arg
process.argv.forEach((val, index) => {
  if (index === 2) {
    input = val
  }
})

if (input) {
  // Read the content from website
  getContent().then((res) => {
    const html = res.toString('utf-8')

    // Parse the head of the table
    const headString = html.match(/\<th\>(.+)\<\/th\>/)[1]
    const heads = headString.split('</th><th>').map((str) => str.trim())

    // parse the body of the table
    const bodyString = html
      .match(/\<td\>(.+)\<\/td\>/)[1]
      .replaceAll('</td><td>', ',')
    const bodies = bodyString
      .split('</td></tr><tr> <td>')
      .map((str) => str.split(','))

    // Convert each row of body to object and store in array
    const data = []

    bodies.map((bd) => {
      const content = {}

      bd.forEach((item, i) => {
        content[heads[i]] = item.trim()
      })

      data.push(content)
    })

    // Find the data that match the input
    const foundData = data.find((item) => item['Fund Name'] === input)
    console.log(foundData.Nav)
  })
}

// Helper function to get website content
function getContent() {
  return new Promise((resolve, reject) => {
    const https = require('https')

    https
      .get(
        {
          hostname: 'codequiz.azurewebsites.net',
          headers: {
            Cookie: `hasCookie=${true}`, // Set cookie so we can get the content
          },
        },
        (res) => {
          const chunks = []

          // Read chunk of data
          res.on('data', (chunk) => {
            chunks.push(chunk)
          })

          res.on('end', () => {
            resolve(Buffer.concat(chunks))
          })
        }
      )
      .on('error', (err) => {
        reject(err)
      })
  })
}
