---
title: "Green Roofs and Thermal Efficiency: A Cyprus Experiment"
date: 2022-12-05T00:00:00+03:00
categories:
  - Portfolio
tags:
  - Post-Hoc Tests
  - R
  - ANOVA
---

<h4>
  Check the code and explanations below. This analysis is used in an article.
</h4>
```
{
``{r packages}
library("dplyr")
library("ggpubr")
library(ggplot2)
library(car)
library("dgof")
library(broom)
library("stargazer")
library("apaTables")
library(tidyverse)
library(ggpubr)
library(rstatix)
library(vtable)
library(psych)
```

```{r loading objects}
save.image(file = "my_work_space.RData")
load("my_work_space.RData")
```

## Descriptive Statistics

Descriptive statistics by group group: control vars n mean sd min max range se X1 1 4431 23.28 11.99 1 60.62 59.62 0.18 -------------------------------------------------------------------------------------------- group: roof1 vars n mean sd min max range se X1 1 4431 23.45 10.55 1.9 56 54.1 0.16 -------------------------------------------------------------------------------------------- group: roof2 vars n mean sd min max range se X1 1 4431 22.69 10.25 2.4 49.4 47 0.15 -------------------------------------------------------------------------------------------- group: roof3 vars n mean sd min max range se X1 1 4067 22.58 10.2 2.53 56.41 53.88 0.16

## APA Corroletion Table

Table 1

Means, standard deviations, and correlations with confidence intervals

Variable M SD 1 2 3\
1. Temperature ᵒc1 23.45 10.55

2.  Temperature ᵒc2 22.69 10.25 .94\*\*\
    [.94, .95]

3.  Temperature ᵒc3 22.58 10.20 .92\*\* .90\*\*\
    [.91, .92] [.89, .90]

4.  Temperature ᵒc4 23.28 11.99 .92\*\* .91\*\* .93\*\*\
    [.92, .93] [.91, .92] [.93, .94]

Note. M and SD are used to represent mean and standard deviation, respectively. Values in square brackets indicate the 95% confidence interval. The confidence interval is a plausible range of population correlations that could have caused the sample correlation (Cumming, 2014). \* indicates p \< .05. \*\* indicates p \< .01.

## Boxplots

```{r boxplotss}
boxplot(Temp~ Group,
        data = df2,
        main = "Temperature",
        xlab = "Groups",
        ylab = "Value",
        col = "white")
```

## Getting Rid Of Outliers

```{r outlier,include=TRUE}
##Getting rid of outliers
quartiles <- quantile(data_full_embeded$`Temperature ᵒc1`, probs=c(.25, .75), na.rm = FALSE)
IQR <- IQR(data_full_embeded$`Temperature ᵒc1`)

Lower <- quartiles[1] - 1.5*IQR
Upper <- quartiles[2] + 1.5*IQR 

df_new <- subset(data_full_embeded, data_full_embeded$`Temperature ᵒc1` > Lower & data_full_embeded$`Temperature ᵒc1` < Upper)

dim(df_new)
##################
quartiles <- quantile(data_full_embeded$`Temperature ᵒc2`, probs=c(.25, .75), na.rm = FALSE)
IQR <- IQR(data_full_embeded$`Temperature ᵒc2`)

Lower <- quartiles[1] - 1.5*IQR
Upper <- quartiles[2] + 1.5*IQR 

df_new <- subset(data_full_embeded, data_full_embeded$`Temperature ᵒc2` > Lower & data_full_embeded$`Temperature ᵒc2` < Upper)

dim(df_new)
###################
quartiles <- quantile(data_full_embeded$`Temperature ᵒc4`, probs=c(.25, .75), na.rm = FALSE)
IQR <- IQR(data_full_embeded$`Temperature ᵒc4`)

Lower <- quartiles[1] - 1.5*IQR
Upper <- quartiles[2] + 1.5*IQR 

df_new <- subset(data_full_embeded, data_full_embeded$`Temperature ᵒc4` > Lower & data_full_embeded$`Temperature ᵒc4` < Upper)

dim(df_new)


```

## Square Root Transformation

```{r sqrt}

#new variables
df_new$sqrttemp1 <- sqrt(df_new$`Temperature ᵒc1`)
df_new$sqrttemp2 <- sqrt(df_new$`Temperature ᵒc2`)
df_new$sqrttemp3 <- sqrt(df_new$`Temperature ᵒc3`)
df_new$sqrttemp4 <- sqrt(df_new$`Temperature ᵒc4`)
```

## QQ Plot

```{r qqplot }
ggqqplot(df2, "Temp", facet.by = "Group")
```

## Density Plots for Checking Normality

```{r density, include=TRUE}
ggdensity(df_new, x = "sqrttemp1", fill = "lightgray", title = "",xlab="Ground Cover") + stat_overlay_normal_density(color = "black", linetype = "dashed")

ggdensity(df_new, x = "sqrttemp2", fill = "lightgray", title = "",xlab="green roof with mixed vegetation")+ stat_overlay_normal_density(color = "black", linetype = "dashed")

ggdensity(df_new, x = "sqrttemp3", fill = "lightgray", title = "",xlab="Bush") + stat_overlay_normal_density(color = "black", linetype = "dashed")

ggdensity(df_new, x = "sqrttemp4", fill = "lightgray", title = "",xlab="Empty Hut") + stat_overlay_normal_density(color = "black", linetype = "dashed")
```

# One Way Anova

## Homogenity of Variance

Homogenity of variance assumption is failed. Therefore, we need to use alternate to One Way Anova which is Welch One way ANOVA test with pairwise t test comparison or Games-Howell post hoc test.

```{r}
model  <- lm(Temp ~ Group, data = df2)
plot(model, 1)
```

### Levenes Test for Homogeneity-FAILED

```{r levene}
df_last %>% levene_test(Temp ~ Group)
```

```{r barlett}
bartlett.test(Temp ~ Group, data = df_last)
```

## Welch One Way Anova

```{r welch one way anova}
# Welch One way ANOVA test
res.aov2 <- df_last %>% welch_anova_test(Temp ~ Group)
# Pairwise comparisons (Games-Howell)
pwc2 <- df_last %>% games_howell_test(Temp ~ Group)
# Visualization: box plots with p-values
pwc2 <- pwc2 %>% add_xy_position(x = "Group", step.increase = 1)
ggboxplot(df_last, x = "Group", y = "Temp") +
  stat_pvalue_manual(pwc2, hide.ns = TRUE) +
  labs(
    subtitle = get_test_label(res.aov2, detailed = TRUE),
    caption = get_pwc_label(pwc2)
    )
```

### Interpretation of Welch Anova and Games Howell Pairwise Comparisons

Since p value is less than α = .05, we reject the null hypothesis which is all group means are equal. In other words,temperatures are equal between the four different types of roofs. According to the graph above, three different roof types are different compared to empty hut (control group).

## Pairwise T Test

```{r pairwise t test}
pwc3 <- df_last %>% 
  pairwise_t_test(
    Temp ~ Group, pool.sd = FALSE,
    p.adjust.method = "bonferroni"
    )
pwc3
```

Note : Time Series Graphs on Tableau will also be added to the report in order to show the difference between control and experimental groups.

## Summary

-   Anova Assumptions *he responses for each factor level have a normal population distribution*

-   These distributions have the same variance

-   The data are independent.

1.  data is not normally distributed but close

2.  Getting rid of outliers

3.  Square root transformation

4.  Making data normally distributed (so close)--first assumption is met

5.  Checking same variance for groups, with levene test--failed to met the variance assumption

6.  Alternative ANOVA method is Welch One Way Anova with Games Howell pairwise comparison

7.  I also added pairwise t test.

### Walch One Way Anova Results

Our sample evidence provides sufficient evidence to conclude that the means of all groups are not equal in the population.

## The Games-Howell Post Hoc Test Results

According to the pairwise group test--Games Howell Post Hoc Test Results, the mean difference between bush roof and ground cover,empty hut and mixed vegetation is statistically significant. Bush roof performs better job for cooling compared to empty roof, ground cover and mixed vegetation roof. In addition, the mean difference between ground cover and mixed vegetation is also statistically significant. This means that ground cover performs a slightly better job than mixed vegetation roof. However, there is no statistically significant evidence to support mean difference between empty roof and ground cover, mixed vegetation.

```{r pwc}
pwc2
```

Means below ;

```{r mean}
df2 %>%
  group_by(Group) %>%
  summarise_at(vars(Temp), list(name = mean),na.rm=TRUE)
```
}
```
