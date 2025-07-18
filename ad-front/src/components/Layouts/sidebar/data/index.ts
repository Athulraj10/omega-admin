import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Omega Dashboard",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Products",
        icon: Icons.PackageIcon,
        items: [
          {
            title: "Add Product",
            url: "/products/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "List Products",
            url: "/products/list",
            icon: Icons.ListIcon,
          },
        ],
      },
      {
        title: "Categories",
        icon: Icons.TagIcon,
        items: [
          {
            title: "All Categories",
            url: "/products/categories/manage",
            icon: Icons.ListIcon,
          },
          {
            title: "Category Tree",
            url: "/products/categories/tree",
            icon: Icons.TagIcon,
          },
          {
            title: "Main Categories",
            url: "/products/categories/main",
            icon: Icons.TagIcon,
          },
          {
            title: "Subcategories",
            url: "/products/categories/sub",
            icon: Icons.TagIcon,
          },
          {
            title: "Add Category",
            url: "/products/categories/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "Category Demo",
            url: "/products/categories/demo",
            icon: Icons.FourCircle,
          },
        ],
      },
      {
        title: "Users",
        icon: Icons.User,
        items: [
          {
            title: "User List",
            url: "/users/list",
            icon: Icons.ListIcon,
          },
          {
            title: "Orders",
            url: "/users/orders",
            icon: Icons.Table,
          },
        ],
      },
      {
        title: "Sellers",
        icon: Icons.SellerIcon,
        items: [
          {
            title: "Seller List",
            url: "/sellers/list",
            icon: Icons.ListIcon,
          },
          {
            title: "Add Seller",
            url: "/sellers/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "Seller Reports",
            url: "/sellers/reports",
            icon: Icons.PieChart,
          },
        ],
      },
      {
        title: "Banners",
        icon: Icons.BannerIcon,
        items: [
          {
            title: "Add Banner",
            url: "/banners/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "List Banners",
            url: "/banners/list",
            icon: Icons.ListIcon,
          },
        ],
      },
      {
        title: "Hero Sliders",
        icon: Icons.SliderIcon,
        items: [
          {
            title: "Add Hero Slider",
            url: "/banners/hero-sliders/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "List Hero Sliders",
            url: "/banners/hero-sliders",
            icon: Icons.ListIcon,
          },
        ],
      },
      {
        title: "Settings",
        icon: Icons.Authentication,
        items: [
          {
            title: "Currencies",
            url: "/settings/currencies",
            icon: Icons.CurrencyIcon,
          },
        ],
      },
    ]
  }
]
