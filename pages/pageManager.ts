import {Page, test} from '@playwright/test'
import { LoginPage } from './loginPage'
import { ProductPage } from './productPage'
import { CardPage } from './cardPage'
import { CheckoutPage } from './checkoutPage'
import { BasePage } from './basePage'

export class PageManager{
    private readonly page: Page
    private readonly login_Page : LoginPage
    private readonly product_Page: ProductPage
    private readonly card_Page: CardPage
    private readonly checkout_Page: CheckoutPage
    private readonly base_Page: BasePage

    constructor(page){
        this.page = page
        this.login_Page = new LoginPage(page)
        this.product_Page = new ProductPage(page)
        this.card_Page = new CardPage(page)
        this.checkout_Page = new CheckoutPage(page)
        this.base_Page = new BasePage(page)
    }

    loginPage(){
        return this.login_Page
    }

    productPage(){
        return this.product_Page
    }

    cardPage(){
        return this.card_Page
    }

    checkoutPage(){
        return this.checkout_Page
    }

    basePage(){
        return this.base_Page
    }
}