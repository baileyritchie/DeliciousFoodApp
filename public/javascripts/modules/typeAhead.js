import axios from 'axios';
import dompurify from 'dompurify';
function searchResultsHTML(stores) {
  return stores.map(store=> {
    return ` 
      <a href="/store/${store.slug}" class="search__result">
      <strong>${store.name}</strong>
      </a>`;
  }).join('')
};

function typeAhead(search) {
  if (!search) return;
  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');
  // on is shortcut for add event listener
  searchInput.on('input', function(){
    // if there is no value quit/do not search
    if(!this.value)
    {
      searchResults.style.display = 'none';
      return;
    }
    searchResults.style.display = 'block';
    axios
      .get(`/api/search?q=${this.value}`)
      .then( res => {
        if(res.data.length) {
            console.log('There is something to show!');
            const html = dompurify.sanitize(searchResultsHTML(res.data));
            searchResults.innerHTML = html;
            console.log(html);
            return;
        } 
        // nothing is found if nothing matches
        searchResults.innerHTML = dompurify.sanitize(`<div class="search_result"> No results for ${this.value} found</div>`);
      })
      .catch( err =>{
        console.error(err);
      });
  });
  // handle keyboard inputs
  // get front end "search drop down working"
  searchInput.on('keyup', (e)=> {
    //38,40,13, don't care if not pressing up down or enter
    if (![38,40,13].includes(e.keyCode)){
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current){
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length-1];
    } else if (e.keyCode === 38){
      next = items[items.length-1];
    } else if (e.keyCode === 13 && current.href){
      console.log('Changing pages');
      console.log(current);
      window.location = current.href;
      return;
    }
    if (current){
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  })
};

export default typeAhead;