//Desafio de la Clase 3

const fs = require ("fs");

class ProductManager {
    constructor (path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(info);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts();
            let id = 1;
            if (products.length > 0) {
                id = Math.max (...products.map((product) => product.id)) + 1;
            }

            const product = { id, ...productData };
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            return error;
        }
    }

    async getProductsById (productId) {
        try {
            const products = await this.getProducts();
            const product = products.find((p) => p.id === productId);
            if (product) {
                return product
            } else {
                return "No product";
            }
        } catch (error) {
            return error;
        }
    }
}