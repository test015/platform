describe('Logging In', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9999') // change URL to match your dev URL
    cy.get('form').within(() => {
      cy.get('input[name="username"]').type('watts')
      cy.get('input[name="password"]').type('cfziu')
      cy.get('button[type=submit]').click()
    })
  })

  it('can get a create a view on a dashboard', () => {
    cy.visit('http://localhost:9999/sources')
    cy.get('table').within(() => {
      cy.get('[data-test="connect-source-button"]')
        .last()
        .click()
    })
    cy.get('.nav--item a[href="/dashboards"]')
      .first()
      .click()

    cy.get('[data-test="create-dashboard-button"]').click()
    cy.get('[data-test="add-cell-button"]').click()
    const script =
      'from(bucket: "telegraf") \n|> range(start: -30m) \n|> filter(fn: (r) => r._measurement == "mem" and r._field == "active")'
    cy.get('.CodeMirror textarea')
      .click({force: true})
      .type(script, {force: true})
    cy.get('.time-machine-query-editor--controls').within(() => {
      cy.get('button[type=submit]').click()
    })

    cy.get('.veo-header').within(() => {
      cy.get('.button-success').click()
    })
  })
})
