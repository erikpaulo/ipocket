package com.softb.ipocket.account.web.resource;

import com.softb.ipocket.account.model.AccountEntry;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Resource that hold the report data.
 * Created by eriklacerda on 3/25/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountEntryReportResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<AccountEntry> data;
    private Double balance;
    private Map<String, Double> groupedEntries;
}
