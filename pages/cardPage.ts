import { Page } from "@playwright/test";

export class CardPage{
    private readonly page: Page

    constructor(page){
        this.page = page
    }

    /**
     * 
     * @param product product name to be removed from card list
     */
    async removeProductFromCardList(product: string){
        const productToBeRemoved = this.page.locator('.cart_item',{hasText: product})
        await productToBeRemoved.locator('button', {hasText: 'Remove'}).click()
    }

    async getCartItems(){
        return await this.page.locator('.inventory_item_name').allTextContents()
    }

    async checkout(){
        await this.page.getByRole('button',{name: 'checkout'}).click()
    }
    
}