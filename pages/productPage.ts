import { Page } from "@playwright/test";


export class ProductPage {
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }


    /**
     * 
     * @param productName the name of the product the user wants to add to the cart
     */
    async addProductToCart(productName: string){
        const product =  this.page.locator('.inventory_item',{hasText: productName})
        await product.locator('button',{hasText: 'Add to cart'}).click()
    }

    shoppingCartBadge(){
        return this.page.locator('.shopping_cart_badge')
    }

    async clickCartLink(){
        await this.page.locator('[data-test="shopping-cart-link"]').click()
    }

    async clickHamburgerMenu(){
        await this.page.locator('#react-burger-menu-btn').click()
    }

    async clickLogOut(){
        await this.page.getByRole('link',{name:'logout'}).click()
    }

    /**
     * 
     * @param option the option the user want to filter products by
     */
    async filterProductsByOption(option: string){
        await this.page.selectOption('[data-test="product-sort-container"]', option)
    }

    async returnAllProductPrices(){
        return await this.page.locator('.inventory_item_price').allTextContents()
    }
    
}