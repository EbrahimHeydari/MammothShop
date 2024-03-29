const div = document.createElement('div')
div.classList.add('products')
document.querySelector('.content').append(div)

const select = document.querySelector('select')
const radios = document.querySelectorAll('.filter__radio')
const inputs = document.querySelectorAll('.filter__input')
const checks = document.querySelectorAll('.filter__check')
const search = document.querySelector('.header__search__bar')

let orderList = JSON.parse(localStorage.getItem('items'))
if (orderList == null) orderList = []
localStorage.setItem('items', JSON.stringify(orderList))

const order = id => {
	if (!orderList.includes(id)) orderList.push(id)
	localStorage.setItem('items', JSON.stringify(orderList))
}

let fromYear
let toYear

const filterProducts = (value, key) => {
	let filteredValue = null

	fetch('../server/data.json')
		.then(Response => Response.json())
		.then(products => {
			switch (key) {
				case 'category':
					filteredValue = products.filter(product => product.category === value)
					break

				case 'status':
					filteredValue = products.filter(product => product.status === value)
					break

				case 'fromYear':
					if (toYear)
						filteredValue = products.filter(
							product => product.year >= value && product.year <= toYear
						)
					else filteredValue = products.filter(product => product.year >= value)
					fromYear = value
					break

				case 'toYear':
					if (fromYear)
						filteredValue = products.filter(
							product => product.year <= value && product.year >= fromYear
						)
					else filteredValue = products.filter(product => product.year <= value)
					toYear = value
					break

				case 'noneAdopted':
					filteredValue = products.filter(product => product.price != value)
					break

				case 'available':
					filteredValue = products.filter(product => product.available == true)
					break

				case 'search':
					value = value.toLowerCase()
					filteredValue = products.filter(product =>
						product.name.toLowerCase().includes(value)
					)
					break

				default:
					filteredValue = products
			}

			div.innerHTML = ''
			filteredValue.map(product => {
				div.innerHTML += `
        <div class='card'>
          <img src='../${product.url}' class='card__image' loading='lazy' alt=${product.name} />
          <div class='card__content'>
            <span>نام: </span>
            <span>${product.name}</span>
          </div>
          <div class='card__content'>
            <span>نوع: </span>
            <span>${product.category}</span>
          </div>
          <div class='card__content'>
            <span>وضعیت: </span>
            <span>${product.status}</span>
          </div>
          <div class='card__content'>
            <span>سال ساخت: </span>
            <span>${product.year}</span>
          </div>
          <div class='card__content'>
            <span>قیمت: </span>
            <span>${product.price}</span>
          </div>
          <div class='card__content'>
            <span>موجود: </span>
            <span>${product.available ? '✅' : '❌'}</span>
          </div>
          <button class='button' onclick="order(${product.id})">سفارش</button>
        </div>
        `
			})
		})
}

filterProducts()

search.onchange = event => filterProducts(event.target.value, 'search')
select.onchange = event => filterProducts(event.target.value, 'category')
radios[0].onchange = event => filterProducts(event.target.value, 'status')
radios[1].onchange = event => filterProducts(event.target.value, 'status')
inputs[0].onblur = event => filterProducts(event.target.value, 'fromYear')
inputs[1].onblur = event => filterProducts(event.target.value, 'toYear')
// TODO fix box
checks[0].onchange = event => filterProducts(event.target.value, 'noneAdopted')
checks[1].onchange = () => filterProducts(null, 'available')
