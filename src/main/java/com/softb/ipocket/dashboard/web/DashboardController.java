package com.softb.ipocket.dashboard.web;

import com.softb.ipocket.dashboard.service.DashboardService;
import com.softb.ipocket.dashboard.web.resource.DashboardResource;
import com.softb.ipocket.dashboard.web.resource.SavingResource;
import com.softb.system.rest.AbstractRestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;

@RestController("AppDashboardController")
@RequestMapping("/api/dashboard")
public class DashboardController extends AbstractRestController<DashboardResource, Integer> {

    @Inject
    DashboardService dashboardService;

    /**
     * Lists some useful information for the current user.
     *
     * @return Dashboard:{
     *     savings:{
     *
     *     }
     * }
     */
    @RequestMapping(method = RequestMethod.GET)
    public DashboardResource get() {

        // Compile the current user savings
        SavingResource savings = dashboardService.getSavingInfo( getGroupId() );

        // Generate sumarized informations.


        return new DashboardResource(savings);
    }
}

