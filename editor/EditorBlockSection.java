/*
 * $Header: $
 * 
 * ==============================================
 * Copyright (C) 2026 Quo Vide B.V.
 * See: http://www.quovide.com/copyright.html 
 * ==============================================
 *  
 * Created on 24 Feb 2026 by jeroen.deken
 */
package com.quovide.project.kpn.partner_newsroom.core.model.editor;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * 
 * @author <a href="mailto:jeroen.deken@quovide.com">jeroen.deken</a>
 * @version $Id: $
 */
@Getter
@Setter
public class EditorBlockSection
{

    private String title;
    private List<EditorBlockOrder> orders = new ArrayList<>();
}
