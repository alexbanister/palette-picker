
exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('projects').insert({
          name: 'Fuzzy Bunnies'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              id: 1,
              project_id: project[0],
              name: 'My Palette',
              color1: '#23edf1',
              color2: '#f19f23',
              color3: '#3323f1',
              color4: '#46f123',
              color5: '#f12361'
            }, {
              id: 2,
              project_id: project[0],
              name: 'My Other Palette',
              color1: '#8a23f1',
              color2: '#daf123',
              color3: '#7e23f1',
              color4: '#479037',
              color5: '#e88ca8'
            }
          ]);
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]); // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
