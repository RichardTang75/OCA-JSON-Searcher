var default_search_term = "Type to search..."

var search_text;
var search_part;
var amount_part;
var page_part;
var sort_part;

function go_to(name)
{
  console.log(name);
}
function clear_text()
{
  if (search_box.value==default_search_term)
    {
      search_box.value="";
    }
  search_box.style.color="black";
}


function default_search()
{
  if (search_box.value=="")
  {
    search_box.value=default_search_term;
    search_box.style.color="#cbcbcb"
  }
}
function get_text_input()
{
  var input_text= document.getElementById("search_box").value;
  return input_text;
}
function get_amount()
{
  var amounts = document.getElementsByName("Results");
  for (i=0; i<amounts.length; i++)
    {
      var cur_rad = amounts[i];
      if (cur_rad.checked)
        {
          return (cur_rad.value);
        }
    }
}
function get_sort()
{
  var sorts = document.getElementsByName("Sort");
  for (i=0; i<sorts.length;i++)
    {
      var cur_sort = sorts[i];
      if (cur_sort.checked)
        {
          return (cur_sort.value);
        }
    }
}
function erase(parent)
{
  while (parent.firstChild)
  {
    parent.removeChild(parent.firstChild);
  }
}
function search()
{
  erase(results_part);
  var search_text = get_text_input();
  if (search_text==default_search_term)
    {
      return true;
    }
  search_part = "?query="+search_text;
  var amount = get_amount();
  amount_part = "&amount="+amount;
  page_part = "&page="+1;
  var sort_style = get_sort();
  sort_part = "&sort="+sort_style;
  var search_url = "https://openclipart.org/search/json/"+search_part+amount_part+page_part+sort_part;
  fetch(search_url)
    .then(response => response.json())
    .then(function(search_json)
      {
          page_dealer(search_json.info);
          results_drawer(search_json.payload);
      }
    )
    .catch(error => console.error(error)); 
}

function go_to_page(page)
{
  erase(results_part);
  if (search_text==default_search_term || search_text=="")
    {
      return true;
    }
  page_part = "&page=" + page;
  var search_url = "https://openclipart.org/search/json/"+search_part+amount_part+page_part+sort_part;
  fetch(search_url)
    .then(response => response.json())
    .then(function(search_json)
          {
    page_dealer(search_json.info);
    results_drawer(search_json.payload);
  }
         )
    .catch(error => console.error(error));
}

function results_drawer(payload)
{
  for (i =0; i<payload.length; i++)
  {
    var search_result = payload[i];
    var new_div = document.createElement('div');
    results_part.append(new_div);
    new_div.className="result_box";
    var image = document.createElement('img');
    image.setAttribute('src', search_result.svg.png_thumb);
    image.setAttribute('w', /*search_result.dimensions.png_thumb.width*/ 50);
    image.setAttribute('h', /*search_result.dimensions.png_thumb.height*/ 50);
    var link = document.createElement('a');
    link.innerHTML="<br>" + search_result.title;
    link.href=search_result.detail_link;
    var text = document.createElement('p');
    text.innerHTML="Uploader: " + search_result.uploader + "<br> Downloads: " + search_result.downloaded_by + "<br> Favorites: " + search_result.total_favorites + "<br> Created: " + search_result.created;
    new_div.append(image);
    new_div.append(link);
    new_div.append(text);
  }
}
function page_dealer(page_info)
{
  erase(page_holder);
  erase(page_holder2);
  var cur_page = page_info.current_page;
  var total_pages = page_info.pages;
  var all_results = page_info.results;
  var increment=1;
  var range=5;
  var start_page = cur_page-range;
  if (start_page<1)
  {
    start_page=1;
  }
  var end_page = cur_page+range;
  if (end_page>total_pages)
  {
    end_page=total_pages;
  }
  for (i=start_page; i<=end_page; i++)
  {
    var new_button = document.createElement('input');
    new_button.setAttribute("type", "button");
    new_button.setAttribute("value", i);
    new_button.setAttribute("name", i);
    new_button.setAttribute("class", "page_button");
    new_button.setAttribute("onclick", "go_to_page(value)");
    if (i==cur_page)
      {
        new_button.style.backgroundColor = "pink";
      }
    var other_new_button = new_button.cloneNode();
    page_holder.appendChild(other_new_button);
    page_holder2.appendChild(new_button);
  }
}
