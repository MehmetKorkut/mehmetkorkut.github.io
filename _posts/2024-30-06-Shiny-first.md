---
title: "First Shiny App for EUR to TRY Exchange Rate Visualization"
date: 2024-06-30T00:00:00+03:00
categories:
  - Portfolio
tags:
  - R Shiny
  - Data Visualization
image: "/assets/images/shiny_app_pic.png"
---



This small project involves the development of a Shiny application that visualizes the exchange rate between the Euro (EUR) and the Turkish Lira (TRY). 
The server component of the app includes two primary functions: get_latest_rate and get_historical_data, which fetch the most recent and historical exchange 
rate data from Yahoo Finance, respectively. The latest_rate reactive expression processes and retrieves the latest closing rate, while historical_data handles 
the retrieval of historical rates dating back to 2010. The UI features a text output displaying the most recent exchange rate and an interactive time series graph 
showcasing the historical exchange rates, generated using the dygraphs package. This setup ensures real-time data updates and provides users with a comprehensive 
view of the EUR/TRY exchange rate trends.
### The Code
```{r shiny, include = TRUE}
# Install necessary packages
install.packages("shiny")
install.packages("quantmod")
install.packages("dygraphs")

# Load required libraries
library(shiny)
library(quantmod)
library(dygraphs)

#The function retrieves the latest exchange rate data for EUR/TRY from Yahoo Finance.I used tryCatch to handle potential
# errors, if there is an error, function returns NULL. This gets the latest rate for the text header.
get_latest_rate <- function() {
  tryCatch({
    # Retrieving data for EUR/TRY
    getSymbols("EURTRY=X", src = "yahoo", from = Sys.Date() - 1, to = Sys.Date(), auto.assign = FALSE)
  }, error = function(e) {
    NULL
  })
}

# Same function system here, gets the time series data for visualization.
get_historical_data <- function() {
  tryCatch({
    # Retrieve data for EUR/TRY from 2010 to today
    getSymbols("EURTRY=X", src = "yahoo", from = "2010-01-01", to = Sys.Date(), auto.assign = FALSE)
  }, error = function(e) {
    NULL
  })
}

# User Interface Components : Title and Sidebar Viz
ui <- fluidPage(
  titlePanel("EUR to TRY Exchange Rate Dashboard"),
  sidebarLayout(
    sidebarPanel(
      h3(textOutput("current_rate"))
    ),
    mainPanel(
      dygraphOutput("exchange_rate_graph")
    )
  )
)


### server component for processing and rendering the data.
server <- function(input, output) {
  # Getting the latest exchange rate, defined function is used
  latest_rate <- reactive({
    data <- get_latest_rate()
    if (!is.null(data)) {
      tail(data$`EURTRY=X.Close`, 1)
    } else {
      "Data unavailable"
    }
  })
  
  # Displaying the latest exchange rate
  output$current_rate <- renderText({
    rate <- latest_rate()
    if (!is.null(rate)) {
      paste("1 EUR =", round(rate, 2), "TRY")
    } else {
      "Data unavailable"
    }
  })
  
  # Time series plot data, predefined function is used
  historical_data <- reactive({
    data <- get_historical_data()
    if (!is.null(data)) {
      data
    } else {
      NULL
    }
  })
  
  # Displaying the historical exchange rate graph
  output$exchange_rate_graph <- renderDygraph({
    data <- historical_data()
    if (!is.null(data)) {
      dygraph(data$`EURTRY=X.Close`, main = "EUR to TRY Exchange Rate") %>%
        dySeries(label = "Exchange Rate") %>%
        dyOptions(drawGrid = FALSE)
    } else {
      NULL
    }
  })
}

# Run the app
shinyApp(ui = ui, server = server)
```
![Shiny App](/assets/images/shiny_app_pic.png)
