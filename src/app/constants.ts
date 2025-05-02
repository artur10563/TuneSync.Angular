export const carouselResponsiveOptions = {
    responsiveOptions: [
        {
            breakpoint: '1300px', // Large screens like desktops or laptops
            numVisible: 4,
            numScroll: 1
        },
        {
            breakpoint: '1200px', // Large screens like desktops or laptops
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '1000px', // Medium screens like tablets (landscape mode)
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '800px', // Small mobile screens
            numVisible: 1,
            numScroll: 1
        }
    ],
    defaultNumVisible: 4,
    defaultNumScroll: 1,

}