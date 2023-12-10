---
title: "Weighted Means Automation for Survey Data"
date: 2023-12-01T00:00:00+03:00
categories:
  - Portfolio
tags:
  - Python
  - Automation
---


```
#packages
import os
import pandas as pd
import pyreadstat
import numpy as np
### Fill the input file, output folder and directory and variables
# Input file and output folder directory
input_file = 'File path'
output_folder = 'Output folder name'
output_filename = 'Output file name'
output_dir = os.path.join(output_folder, output_filename)

# Loading the data
df, metadata = pyreadstat.read_sav(input_file)

# Printing information about the loaded data
print("Data Shape:", df.shape)
print("Column Names:", df.columns)
print("Data Types:", df.dtypes)

# Inputs--Scales, Grouping variables, and weight (if exists)
scales = ['Scale1','Scale2','Scale3']

grouping_vars = ['Group_var1','Group_var2']  # Add more grouping variables as needed
weight = 'weights'  # Change this to your actual weight column name
#### END OF INPUTS
# Dictionary to store the results for each grouping variable
results_dict = {}

# Iterating over grouping variables
for grouping_var in grouping_vars:
    # List to store the results for the current grouping variable
    results = []

    # Iterating over scales
    for scale in scales:
        # Getting the label of the scale
        scale_label = metadata.variable_to_label.get(scale, scale)

        # Print some information for debugging
        print(f"Processing scale: {scale}, Label: {scale_label}")

        # Check if the scale variable is in the dataset
        if scale in df.columns:
            # Print some information for debugging
            print(f"Processing scale: {scale}, Label: {scale_label}")

            # Pivot table to calculate the weighted means
            pivot_table = pd.pivot_table(
                df,
                values=scale,
                index=grouping_var,
                aggfunc=lambda x: np.average(x, weights=df.loc[x.index, weight])
            ).reset_index()

            # Convert grouping_var values to labels
            if grouping_var in metadata.variable_value_labels:
                value_labels = metadata.variable_value_labels[grouping_var]
                pivot_table[grouping_var] = pivot_table[grouping_var].replace(value_labels)

            # Rename the column to include the scale information
            pivot_table.columns = [grouping_var, f'{scale_label}_{scale}']

            # Print intermediate results for debugging
            print(f"Intermediate Result for {scale}:\n{pivot_table}")

            # Add the results to the list
            results.append(pivot_table)
        else:
            print(f"Warning: Variable {scale} not found in the dataset. Skipping...")

    # Merge the results on the grouping_var column for the current grouping variable
    final_result = results[0]
    for result in results[1:]:
        final_result = pd.merge(final_result, result, on=grouping_var)

    # Transpose the final result table
    final_result_transposed = final_result.set_index(grouping_var).T.reset_index()

    # Add the final result to the dictionary
    results_dict[grouping_var] = final_result_transposed

# Save the transposed final results for each grouping variable to separate Excel sheets
with pd.ExcelWriter(output_dir + '.xlsx', engine='xlsxwriter') as writer:
    for grouping_var, result_df in results_dict.items():
        # Write the DataFrame to Excel
        result_df.to_excel(writer, sheet_name=f'{grouping_var}_Sheet', index=False, header=True)

        # Access the XlsxWriter workbook and worksheet objects from the dataframe writer object.
        workbook = writer.book
        worksheet = writer.sheets[f'{grouping_var}_Sheet']

        # Get the dimensions of the dataframe.
        num_rows, num_cols = result_df.shape

        # Create a list of column headers, to use in add_table().
        column_settings = [{'header': column} for column in result_df.columns]

        # Add the Excel table structure. Pandas will add the data.
        worksheet.add_table(0, 0, num_rows, num_cols - 1, {'columns': column_settings})

        # Define cell formats for the header, numbers, and other cells
        header_format = workbook.add_format({'bg_color': '#ADC4CE', 'align': 'center', 'valign': 'vcenter'})
        number_format = workbook.add_format({'bg_color': '#EEE0C9', 'align': 'center', 'valign': 'vcenter'})
        cell_format = workbook.add_format({'align': 'center', 'valign': 'vcenter'})

        # Apply the header format to the column names only
        for col_num, value in enumerate(result_df.columns.values):
            worksheet.write(0, col_num, value, header_format)

        # Apply the number format to the entire table (excluding the header)
        for row_num in range(1, num_rows + 1):
            for col_num in range(num_cols):
                worksheet.write(row_num, col_num, result_df.iloc[row_num - 1, col_num], number_format)

        # Autofit column width
        for col_num, value in enumerate(result_df.columns.values):
            max_len = max(result_df[value].astype(str).apply(len).max(), len(value)) + 2
            worksheet.set_column(col_num, col_num, max_len)
```
