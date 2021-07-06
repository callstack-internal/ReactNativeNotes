﻿#include "pch.h"
#include "MainPage.h"
#if __has_include("MainPage.g.cpp")
#include "MainPage.g.cpp"
#endif

#include "App.h"

using namespace winrt;
using namespace Windows::UI::Xaml;

namespace winrt::ReactNativeNotes::implementation
{
    MainPage::MainPage()
    {
        InitializeComponent();
        auto app = Application::Current().as<App>();
        Navigate( L"NotesPage", false );
    }

    void MainPage::ItemInvokedEventHandler( Microsoft::UI::Xaml::Controls::NavigationView const& sender, Microsoft::UI::Xaml::Controls::NavigationViewItemInvokedEventArgs const& args )
    {
        if( args.IsSettingsInvoked() == true )
        {
            Navigate( L"SettingsPage" );
        }
        else if( args.InvokedItemContainer() != nullptr )
        {
            auto selectedPageTag = unbox_value_or<hstring>( args.InvokedItemContainer().Tag(), L"" );
            Navigate( selectedPageTag );
        }
    }

    void MainPage::BackRequestedEventHandler( Microsoft::UI::Xaml::Controls::NavigationView const& sender, Microsoft::UI::Xaml::Controls::NavigationViewBackRequestedEventArgs const& args )
    {
    }

    void MainPage::Navigate( hstring pageName, const bool hasAnimation ) noexcept
    {
        auto pageToNavigateTo = Windows::UI::Xaml::Interop::TypeName
        {
            to_hstring( L"ReactNativeNotes." + pageName ),
            Windows::UI::Xaml::Interop::TypeKind::Custom
        };
        if( hasAnimation )
        {
            auto navigationAnimation = Windows::UI::Xaml::Media::Animation::SlideNavigationTransitionInfo();
            navigationAnimation.Effect( Windows::UI::Xaml::Media::Animation::SlideNavigationTransitionEffect::FromBottom );
            ApplicationContentFrame().Navigate( pageToNavigateTo, nullptr, navigationAnimation );
        }
        else
        {
            auto navigationAnimation = Windows::UI::Xaml::Media::Animation::SuppressNavigationTransitionInfo();
            ApplicationContentFrame().Navigate( pageToNavigateTo, nullptr, navigationAnimation );
        }
    }
}
