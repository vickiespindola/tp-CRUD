const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* recibe dos parámetros. El precio y el descuento */
const finalPrice = (price, discount) => Math.round(price - (price * (discount/100)))


const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products, 
		    toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const {id} = req.params
        const productDetail = products.find(e => e.id === +id)
		console.log(productDetail);
		res.render('detail', {productDetail, toThousand, finalPrice
		
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form') /* renderiza <--- archivo en views */
	},
	
	// Create -  Method to store
	store: (req, res) => {
	     const product = req.body /* req.body: para acceder a la info que viene del formulario */
	     product.id = products.length + 1;
	     
		 products.push(product);

		 fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
/* para redirigir al usuario con la carga del nuevo producto */
		 res.redirect(`/products/detail/${product.id}`);
	},
	// Update - Form to edit
	edit: (req, res) => {
		/* para enviar el producto que tengo que editar */
		const product = products.find(e => e.id === +req.params.id)
		res.render('product-edit-form', {product})
	},
	// Update - Method to update
	update: (req, res) => {
	    const productUpdate = products.find(product => product.id === +req.params.id)
		const {name, price, discount, category, description} = req.body
		if (productUpdate){
          productUpdate.name = name
		  productUpdate.price = +price
		  productUpdate.discount = +discount
		  productUpdate.category = category
		  productUpdate.description = description

		  fs.writeFileSync(productsFilePath, JSON.stringify(products))
		
		  res.redirect(`/products/detail/${req.params.id}`) /* backticks, signo peso y llaves para que ponga lo que está dentor de la variable  */
		}else{
			res.redirect('/')
		}
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter(product => product.id !== +req.params.id)

		fs.writeFileSync(productsFilePath, JSON.stringify(products))
		res.redirect('/')
	}
};

module.exports = controller;