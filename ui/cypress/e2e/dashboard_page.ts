describe('The Dashboard Page', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('can create a dashboard', () => {
    cy.get('.nav--item a[href="/dashboards"]')
      .first()
      .click()
    cy.get('[data-test="create-dashboard-button"]').click()
  })

  // it('can get a create a view on a dashboard', () => {
  //   cy.get('[data-test="add-cell-button"]').click()
  //   const script =
  //     'from(bucket: "telegraf") \n|> range(start: -30m) \n|> filter(fn: (r) => r._measurement == "mem" and r._field == "active")'

  //   cy.get('.CodeMirror textarea')
  //     .click({force: true})
  //     .type(script, {force: true})
  //   cy.get('.time-machine-query-editor--controls').within(() => {
  //     cy.get('button[type=submit]').click()
  //   })

  //   cy.get('.veo-header').within(() => {
  //     cy.get('.button-success').click()
  //   })
  // })
})
