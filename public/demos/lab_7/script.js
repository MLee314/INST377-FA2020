function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function getRandomIntInclusive(min, max) {
  const min1 = Math.ceil(min);
  const max1 = Math.floor(max);
  return Math.floor(Math.random() * (max1 - min1 + 1) + min1); // The maximum is inclusive and the minimum is inclusive
}

async function loadData() {
  const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const json = await data.json();

  const arrayOfTenItems = range(10);
  const randomRestaurantsArray = arrayOfTenItems.map((item) => {
    const which = getRandomIntInclusive(0, json.length);
    const restaurant = json[which]; // we are not worrying about uniqueness here
    return restaurant;
  });

  console.table(randomRestaurantsArray); // This shows the shape of our data as it arrives

  const div = document.createElement('div');
  div.innerHTML = `<h2>What we have</h2> <br />${JSON.stringify(randomRestaurantsArray[0])}<br /><br />`;
  $('body').append(div);

  /// And now, how to get what we want
  const newDataShape = randomRestaurantsArray.reduce((collection, item, i) => {
    // for each item, check if we have a category for that item already
    const findCat = collection.find((findItem) => findItem.label === item.category);
    
    if (!findCat) {
      collection.push({
        label: item.category,
        y: 1
      });
    } else {
      const position = collection.findIndex(el => el.label === item.category);
      collection[position].y += 1;
    }
    return collection;
  }, []);

  console.table(newDataShape);

  const div2 = document.createElement('div');
  const obj = {
    label: randomRestaurantsArray[0].category,
    y: randomRestaurantsArray.length
  };
  div2.innerHTML = `<h2>What we want</h2> <br /> <h4>A category, how many things are in the category</h4><pre><code class="language-javascript">${JSON.stringify(obj)}</pre></code>`;

  $('body').append(div2);
}

window.onload = loadData;