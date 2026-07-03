package com.softcommerce.views.uipaneltftipomovinventario;

import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.RegisterTipoMovInventario;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.TipoMovInventarioTableModel;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class UiPanelTFTipoMovInventarioImpl extends UiPanelTFTipoMovInventario {

    public UiPanelTFTipoMovInventarioImpl(String title, JFrame frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPanelTFTipoMovInventarioImpl(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }
}
