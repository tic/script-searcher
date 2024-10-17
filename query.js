[
  {
    $search: {
      compound: {
        must: [
          {
            text: {
              path: 'show',
              query: 'Seinfeld'
            }
          },
          {     
            text: {
              path: 'script',
              query: "his mother was a mudder"
            }
          }
        ]
      }
    }
  }
]